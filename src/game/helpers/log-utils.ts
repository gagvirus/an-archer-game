import ModuleManager, {Module} from '../modules/module-manager.ts';
import LogModule from '../modules/log-module.ts';

export enum LogEntryCategory {
    General, // anything not falling in categories below
    Combat, // attack, death or skill usage
    World, // level started, something spawned, event started
    Loot, // resource, xp or item gained
}

export interface LogEntry {
    message: string;
    category: LogEntryCategory;
    highlights?: Highlights;
}

interface HighlightDict {
    value: string;
    color?: string;
}

type HighlightList = [string, string];

type Highlight = HighlightDict | HighlightList | string | number;

export type Highlights = { [key: string]: Highlight };


const addLogEntry = (message: string, category: LogEntryCategory = LogEntryCategory.General) => {
    const logManager = ModuleManager.getInstance().getModule<LogModule>(Module.logs);
    if (logManager) {
        logManager.addLogEntry(message, category);
    }
}


const addFancyLogEntry = (message: string, highlights: Highlights = {}, category: LogEntryCategory = LogEntryCategory.General) => {
    const logManager = ModuleManager.getInstance().getModule<LogModule>(Module.logs);
    if (logManager) {
        logManager.addFancyLogEntry(message, highlights, category);
    }
}

export {addLogEntry, addFancyLogEntry};
