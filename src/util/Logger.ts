import chalk from "chalk";
// tslint:disable:no-var-requires
const util = require("util");
const fs = require("fs");

// tslint:disable: no-bitwise

export const enum LogLevel {
    Error = 1,
    Warning = 2,
    Info = 4,
    Debug = 8,
}

const consoles:ILogger[] = [];

export interface ILogger {
    setLevel(level:LogLevel);
    warning(message:string);
    debug(message:string);
    error(message:string);
    info(message:string);
}

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

export class FileLogger implements ILogger {
    private logLevel;
    private stream;

    constructor(pathToFile:string) {
        this.stream = fs.createWriteStream(pathToFile);
        this.stream.once("open", (fd) => {/**/});
    }

    public setLevel(level:LogLevel) {
        this.logLevel = level;
    }

    public warning(message:string) {
        if ((this.logLevel & LogLevel.Warning) !== LogLevel.Warning) {
            // return;
        }

        this.stream.write(message + "\n");
    }

    public debug(message:string) {
        if ((this.logLevel & LogLevel.Debug) !== LogLevel.Debug) {
            // return;
        }

        this.stream.write(message + "\n");
    }

    public error(message:string) {
        if ((this.logLevel & LogLevel.Error) !== LogLevel.Error) {
            // return;
        }

        this.stream.write(message + "\n");
    }

    public info(message:string) {
        if ((this.logLevel & LogLevel.Info) !== LogLevel.Info) {
            // return;
        }

        this.stream.write(message + "\n");
    }
}

export class ConsoleLogger implements ILogger {
    private logLevel;

    constructor() {
        this.logLevel = 1 & 2 & 4 & 8;
    }

    public setLevel(level:LogLevel) {
        this.logLevel = level;
    }

    public warning(message:string) {
        if ((this.logLevel & LogLevel.Warning) !== LogLevel.Warning) {
            // return;
        }

        (console).log(chalk.yellow(message));
    }

    public debug(message:string) {
        if ((this.logLevel & LogLevel.Debug) !== LogLevel.Debug) {
            // return;
        }

        (console).log(message);
    }

    public error(message:string) {
        if ((this.logLevel & LogLevel.Error) !== LogLevel.Error) {
            // return;
        }

        (console).log(chalk.red(message));
    }

    public info(message:string) {
        if ((this.logLevel & LogLevel.Info) !== LogLevel.Info) {
            // return;
        }

        (console).log(message);
    }
}
