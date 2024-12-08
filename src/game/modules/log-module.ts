import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import {convertHighlightToHighlightDict, Highlights, LogEntry, LogEntryCategory} from "../helpers/log-utils.ts";
import {createText} from "../helpers/text-helpers.ts";
import {COLOR_WHITE} from "../helpers/colors.ts";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import {AbstractModule} from "./module-manager.ts";
import TextStyle = Phaser.GameObjects.TextStyle;
import FixWidthSizer = UIPlugin.FixWidthSizer;

class LogModule extends AbstractModule {
    MAX_ENTRIES = 1000;
    private static entries: LogEntry[] = [];
    _entryTexts: FixWidthSizer[] = [];
    logPanel?: ScrollablePanel;

    start(): void {
        this.logPanel = this.createLogPanel();
        // re-render messages if there are already stored ones
        LogModule.entries.forEach((logEntry) => this.renderLogEntry(logEntry))
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
        LogModule.entries = [];
    }

    private pushLogEntry(logEntry: LogEntry) {
        LogModule.entries.push(logEntry);
        if (LogModule.entries.length >= this.MAX_ENTRIES) {
            LogModule.entries.shift(); // Remove the oldest entry
            this._entryTexts.shift()?.destroy(); // Remove reference to the text object as well and destroy
        }
        this.renderLogEntry(logEntry);
    }

    addLogEntry(message: string, highlights: Highlights = {}, category: LogEntryCategory = LogEntryCategory.General) {
        const logEntry: LogEntry = {message, highlights, category};
        this.pushLogEntry(logEntry)
    }

    private renderLogEntry(logEntry: LogEntry) {
        if (!this.logPanel) {
            return;
        }
        const {message, highlights} = logEntry;
        const messageParts: { message: string, style?: Partial<TextStyle> }[] = [];
        let remainingMessage = message;
        Object.keys(highlights).forEach((highlightKey: string) => {
            const parts = remainingMessage.split(`:${highlightKey}`);
            const highlightDict = convertHighlightToHighlightDict(highlights[highlightKey]);
            messageParts.push({message: parts[0]});
            messageParts.push({message: highlightDict.value, style: {color: highlightDict.color, fontStyle: "bold"}})
            remainingMessage = parts[1];
        })

        messageParts.push({message: remainingMessage});

        const container = this.scene.rexUI.add.fixWidthSizer({
            width: 300,
            align: "left"
        });
        let xOffset = 0;
        messageParts.forEach((messagePart) => {
            const text = createText(
                this.scene,
                messagePart.message,
                {x: xOffset, y: 0},
                12, "left", false,
                COLOR_WHITE,
                {...messagePart.style}
            );
            container.add(text);
            xOffset += text.width + 5;
        });

        const panel = this.logPanel.getElement("panel") as ScrollablePanel;
        this._entryTexts.push(container)
        panel.add(container); // Add the log entry to the scrollable panel
        this.logPanel.layout(); // Re-layout the panel to adjust to new content
        // Auto-scroll to the bottom to show the latest entry
        this.logPanel.scrollToBottom();
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
                    orientation: "vertical",
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
