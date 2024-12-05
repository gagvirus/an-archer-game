import AbstractModule from './abstract-module.ts';
import {createText} from '../helpers/text-helpers.ts';
import {VectorZeroes} from '../helpers/position-helper.ts';
import {COLOR_WHITE} from '../helpers/colors.ts';
import ScrollablePanel from 'phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel';
import {LogEntry, LogEntryCategory} from '../helpers/log-utils.ts';
import {GameObjects} from 'phaser';

class LogModule extends AbstractModule {
    MAX_ENTRIES = 1000;
    private static _entries: LogEntry[] = [];
    _entryTexts: GameObjects.Text[] = [];
    logPanel?: ScrollablePanel;

    start(): void {
        this.logPanel = this.createLogPanel();
        // re-render messages if there are already stored ones
        LogModule._entries.forEach((logEntry) => this.renderLogEntry(logEntry))
    }

    stop(): void {
        if (this.logPanel) {
            this.logPanel.destroy();
            this._entryTexts.forEach(text => text.destroy())
            this._entryTexts = [];

            this.logPanel = undefined;
        }
    }

    update(): void {
    }

    static cleanEntries(): void {
        LogModule._entries = [];
    }


    /**
     * Adds a new log entry to the log panel.
     * @param message The log message to display.
     * @param category The category of the message.
     */
    addLogEntry(message: string, category: LogEntryCategory = LogEntryCategory.General) {
        const logEntry: LogEntry = {message, category};
        LogModule._entries.push(logEntry);
        if (LogModule._entries.length >= this.MAX_ENTRIES) {
            LogModule._entries.shift(); // Remove the oldest entry
            this._entryTexts.shift()?.destroy(); // Remove reference to the text object as well and destroy
        }
        this.renderLogEntry(logEntry);
    }

    private renderLogEntry(logEntry: LogEntry) {
        const {message} = logEntry;
        if (this.logPanel) {
            const logText = createText(this.scene, message, VectorZeroes(), 12, 'left', false, COLOR_WHITE, {fixedWidth: 300});
            const panel = this.logPanel.getElement('panel') as ScrollablePanel;
            this._entryTexts.push(logText)
            panel.add(logText); // Add the log entry to the scrollable panel
            this.logPanel.layout(); // Re-layout the panel to adjust to new content
            // Auto-scroll to the bottom to show the latest entry
            this.logPanel.scrollToBottom();
        }
    }

    private createLogPanel(): ScrollablePanel {
        return this.scene.rexUI.add.scrollablePanel({
            x: this.scene.scale.width - 170, // Bottom-right corner
            y: this.scene.scale.height - 100,
            width: 300,
            height: 200,

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
}

export default LogModule;
