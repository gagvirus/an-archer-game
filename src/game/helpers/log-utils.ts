import ModuleManager, {Module} from '../modules/module-manager.ts';
import LogModule from '../modules/log-module.ts';
import {formatNumber} from './text-helpers.ts';
import {COLOR_WHITE} from './colors.ts';

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

const convertHighlightToHighlightDict = (highlight: Highlight): HighlightDict => {
    if (typeof highlight === 'number') {
        highlight = formatNumber(highlight);
    }
    if (typeof highlight === 'string') {
        highlight = {value: highlight, color: COLOR_WHITE};
    } else if (Array.isArray(highlight)) {
        highlight = {value: highlight[0], color: highlight[1] ?? COLOR_WHITE}
    }
    return highlight;
}

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

export {addLogEntry, addFancyLogEntry, convertHighlightToHighlightDict};
