import {Scene} from 'phaser';
import ScrollablePanel from 'phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel';
import {createText} from './text-helpers.ts';
import {COLOR_DANGER, COLOR_SUCCESS, COLOR_WARNING, COLOR_WHITE} from './colors.ts';
import {VectorZeroes} from './position-helper.ts';
import Hero from '../logic/Hero.ts';
import TextStyle = Phaser.GameObjects.TextStyle;
import Enemy from '../logic/Enemy.ts';

interface StylizedTextPart {
    text?: string | number;
    style?: Partial<TextStyle>;
}

type StylizedTextPartOrStringOrHeroOrEnemy = StylizedTextPart | string | Enemy | Hero;

type StylizedText = StylizedTextPartOrStringOrHeroOrEnemy[];

class LogManager {
    scene: Scene;
    logPanel: ScrollablePanel;

    private static _instance: LogManager;

    static getInstance(scene?: Scene) {
        if (scene) {
            LogManager._instance = new LogManager(scene);
        }
        return LogManager._instance;
    }

    private constructor(scene: Scene) {
        this.scene = scene;
        this.logPanel = this.createLogPanel();
    }

    createLogPanel(): ScrollablePanel {
        return this.scene.rexUI.add.scrollablePanel({
            x: this.scene.scale.width - 260, // Bottom-right corner
            y: this.scene.scale.height - 150,
            width: 480,
            height: 300,

            scrollMode: 0, // 0 for vertical scrolling
            background: this.scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, 0x333333),

            panel: {
                child: this.scene.rexUI.add.sizer({
                    orientation: 'vertical',
                    space: {item: 10} // Space between log entries
                }),

                mask: {
                    padding: 1
                }
            },

            slider: {
                track: this.scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x888888),
                thumb: this.scene.rexUI.add.roundRectangle(0, 0, 20, 30, 10, 0xffffff)
            },
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                panel: 10
            }
        }).layout();
    }

    /**
     * Adds a new log entry to the log panel.
     * @param message The log message to display.
     */
    addLogEntry(message: string) {
        const logText = createText(this.scene, message, VectorZeroes(), 12, 'left', false, COLOR_WHITE, {fixedWidth: 480});

        if (this.logPanel) {
            const panel = this.logPanel.getElement('panel') as ScrollablePanel;
            panel.add(logText); // Add the log entry to the scrollable panel
            this.logPanel.layout(); // Re-layout the panel to adjust to new content
            // Auto-scroll to the bottom to show the latest entry
            this.logPanel.scrollToBottom();
        }
    }

    addLogEntryStylized(messageParts: StylizedText) {
        const defaultTextStyle: Partial<TextStyle> = {fontStyle: 'normal', color: COLOR_WHITE};


        const heroPartyTextStyle: Partial<TextStyle> = {fontStyle: 'bold', color: COLOR_SUCCESS};
        const enemyPartyTextStyle: Partial<TextStyle> = {fontStyle: 'bold', color: COLOR_DANGER};

        const container = this.scene.add.container();
        const panel = this.logPanel.getElement('panel') as ScrollablePanel;


        let xOffset = 0;

        messageParts.forEach((part) => {
            if (typeof part === 'string') {
                part = {
                    text: part as string,
                    style: defaultTextStyle,
                }
            } else if (part instanceof Enemy) {
                part = {
                    text: part.name,
                    style: enemyPartyTextStyle,
                }
            } else if (part instanceof Hero ) {
                part = {
                    text: part.name,
                    style: heroPartyTextStyle,
                }
            }
            const {text, style} = part;

            // Create a styled text object for each part
            const textObj = this.scene.add.text(xOffset, 0, text ?? '', style ?? defaultTextStyle);
            container.add(textObj);

            // Update xOffset for the next text part
            xOffset += textObj.width + 5; // Adjust spacing as needed
        });
        panel.add(container); // Add the log entry to the scrollable panel
    }
}

enum LogEntryType {
    DamageDealt,
    CritDamageDealt,
    HealthReplenished,
    KilledEnemy,
    GainedXp,
    EvadedAttack,
    LeveledUp,
    ReceivedStatPoints,
    StageStarted,
}

interface LogEntryParty {
    name: string;
}

interface LogEntryData {
    firstParty?: LogEntryParty,
    secondParty?: LogEntryParty,
    amount?: number,
    amount2?: number,
    amountStyle?: Partial<TextStyle>,
}

const getLogEntryMessageByType = (type: LogEntryType, data: LogEntryData = {}): StylizedText => {
    const {firstParty, secondParty, amountStyle = {}, amount, amount2} = data;
    // todo: make first & second party bold
    //  if party is enemy -> red
    //  else -> green
    // todo: also make sure to highlight amounts as well
    switch (type) {
        // case LogEntryType.DamageDealt:
        //     return `${firstParty?.name} attacked ${secondParty?.name} for ${amount} DMG`;
        // case LogEntryType.CritDamageDealt:
        //     return (`${firstParty?.name} inflicted ${amount} CRIT on ${secondParty?.name}`);
        // case LogEntryType.HealthReplenished:
        //     return `${firstParty?.name} Replenished ${amount} HP`;
        // case LogEntryType.KilledEnemy:
        //     return `${firstParty?.name} killed ${secondParty?.name}`;
        // case LogEntryType.GainedXp:
        //     return `${firstParty?.name} gained ${amount} XP`;
        // case LogEntryType.EvadedAttack:
        //     return `${firstParty?.name} evaded attack from ${secondParty?.name}`;
        // case LogEntryType.LeveledUp:
        //     return `${firstParty?.name} has become LVL ${amount} !`;
        // case LogEntryType.ReceivedStatPoints:
        //     return `${firstParty?.name} has received ${amount} stat points.`;
        case LogEntryType.StageStarted:
            return [
                'Start Stage ',
                {text: amount, style: amountStyle},
                ' - ',
                {text: amount2, style: amountStyle},
                ' enemies spawned.',
            ]
    }

    throw new Error(`Invalid entry type received ${type}`);
}

const addDamageDealtLogEntry = (firstParty: LogEntryParty, secondParty: LogEntryParty, amount: number) => {
    const message = getLogEntryMessageByType(LogEntryType.DamageDealt, {
        firstParty,
        secondParty,
        amount,
        amountStyle: {color: COLOR_DANGER},
    });
    addLogEntryStylized(message);
}
const addCritDamageDealtLogEntry = (firstParty: LogEntryParty, secondParty: LogEntryParty, amount: number) => {
    const message = getLogEntryMessageByType(LogEntryType.CritDamageDealt, {
        firstParty,
        secondParty,
        amount,
        amountStyle: {color: COLOR_WARNING},
    });
    addLogEntryStylized(message);
}
const addHealthReplenishedLogEntry = (firstParty: LogEntryParty, amount: number) => {
    const message = getLogEntryMessageByType(LogEntryType.HealthReplenished, {
        firstParty,
        amount,
        amountStyle: {color: COLOR_SUCCESS},
    });
    addLogEntryStylized(message);
}
const addKilledEnemyLogEntry = (firstParty: LogEntryParty, secondParty: LogEntryParty) => {
    const message = getLogEntryMessageByType(LogEntryType.KilledEnemy, {
        firstParty,
        secondParty,
    });
    addLogEntryStylized(message);
}
const addGainedXpLogEntry = (firstParty: LogEntryParty, amount: number) => {
    const message = getLogEntryMessageByType(LogEntryType.GainedXp, {
        firstParty,
        amount,
        amountStyle: {color: COLOR_SUCCESS},
    });
    addLogEntryStylized(message);
}
const addEvadedAttackLogEntry = (firstParty: LogEntryParty, secondParty: LogEntryParty) => {
    const message = getLogEntryMessageByType(LogEntryType.EvadedAttack, {
        firstParty,
        secondParty,
    });
    addLogEntryStylized(message);
}
const addLeveledUpLogEntry = (firstParty: LogEntryParty, amount: number) => {
    const message = getLogEntryMessageByType(LogEntryType.LeveledUp, {
        firstParty,
        amount,
        amountStyle: {color: COLOR_SUCCESS},
    });
    addLogEntryStylized(message);
}
const addReceivedStatPointsLogEntry = (firstParty: LogEntryParty, amount: number) => {
    const message = getLogEntryMessageByType(LogEntryType.ReceivedStatPoints, {
        firstParty,
        amount,
        amountStyle: {color: COLOR_WARNING},
    });
    addLogEntryStylized(message);
}
const addStageStartedLogEntry = (amount: number, amount2: number) => {
    const message = getLogEntryMessageByType(LogEntryType.StageStarted, {
        amount,
        amount2,
        amountStyle: {color: COLOR_WARNING},
    });
    addLogEntryStylized(message);
}

const addLogEntry = (message: string) => {
    const logManager = LogManager.getInstance();
    logManager.addLogEntry(message);
}

const addLogEntryStylized = (message: StylizedText) => {
    const logManager = LogManager.getInstance();
    logManager.addLogEntryStylized(message);
}

export {
    LogManager,
    addLogEntry,
    addDamageDealtLogEntry,
    addCritDamageDealtLogEntry,
    addHealthReplenishedLogEntry,
    addKilledEnemyLogEntry,
    addGainedXpLogEntry,
    addEvadedAttackLogEntry,
    addLeveledUpLogEntry,
    addReceivedStatPointsLogEntry,
    addStageStartedLogEntry
};
