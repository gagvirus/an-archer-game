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
}

const addLogEntry = (message: string, category: LogEntryCategory = LogEntryCategory.General) => {
    const logManager = ModuleManager.getInstance().getModule<LogModule>(Module.logs);
    if (logManager) {
        logManager.addLogEntry(message, category);
    }
}

export {addLogEntry};
