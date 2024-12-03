import {Scene} from 'phaser';
import ScrollablePanel from 'phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel';
import {createText} from './text-helpers.ts';
import {COLOR_WHITE} from './colors.ts';
import {VectorZeroes} from './position-helper.ts';

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
}

const addLogEntry = (message: string) => {
    const logManager = LogManager.getInstance();
    logManager.addLogEntry(message);
}

export {LogManager, addLogEntry};
