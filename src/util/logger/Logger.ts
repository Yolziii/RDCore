import chalk from "chalk";
import {ILogger} from "./ILogger";

// tslint:disable:no-var-requires
const util = require("util");

let consoles:ILogger[] = [];

function format(message:string, args:any) {
    for (const next of args) {
        message = util.format(message, next);
    }
    return message;
}

export const Logger = {
    add(logger: ILogger) {
        consoles.push(logger);
    },

    clear() {
        consoles = [];
    },

    info(message: string, ...args) {
        for (const logger of consoles) {
            logger.info(format(message, args));
        }
    },

    debug(message: string, ...args) {
        for (const logger of consoles) {
            logger.debug(format(message, args));
        }
    },

    warning(message: string, ...args) {
        for (const logger of consoles) {
            logger.warning(format(message, args));
        }
    },

    error(message: string, ...args) {
        for (const logger of consoles) {
            logger.error(format(message, args));
        }
    }
};
