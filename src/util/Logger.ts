import chalk from "chalk";
// tslint:disable:no-var-requires
const util = require("util");

// tslint:disable: no-bitwise

export const enum LogLevel {
    Error = 1,
    Warning = 2,
    Info = 4,
    Debug = 8,
}

let consoles:ILogger[] = [];

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

export class StreamLogger implements ILogger {
    private logLevel;
    private stream;

    constructor(logStream) {
        this.logLevel = LogLevel.Debug | LogLevel.Info | LogLevel.Warning | LogLevel.Error;
        this.stream = logStream;
    }

    public setLevel(level:LogLevel) {
        this.logLevel = level;
    }

    public warning(message:string) {
        if ((this.logLevel & LogLevel.Warning) !== LogLevel.Warning) {
            return;
        }

        this.stream.write(chalk.yellow(message) + "\n");
    }

    public debug(message:string) {
        if ((this.logLevel & LogLevel.Debug) !== LogLevel.Debug) {
            return;
        }

        this.stream.write(chalk.gray(message) + "\n");
    }

    public error(message:string) {
        if ((this.logLevel & LogLevel.Error) !== LogLevel.Error) {
            return;
        }

        this.stream.write(chalk.red(message) + "\n");
    }

    public info(message:string) {
        if ((this.logLevel & LogLevel.Info) !== LogLevel.Info) {
            return;
        }

        this.stream.write(message + "\n");
    }
}

export class ConsoleLogger implements ILogger {
    private logLevel;

    constructor() {
        this.logLevel = LogLevel.Debug | LogLevel.Info | LogLevel.Warning | LogLevel.Error;
    }

    public setLevel(level:LogLevel) {
        this.logLevel = level;
    }

    public warning(message:string) {
        if ((this.logLevel & LogLevel.Warning) !== LogLevel.Warning) {
            return;
        }

        (console).log(chalk.yellow(message));
    }

    public debug(message:string) {
        if ((this.logLevel & LogLevel.Debug) !== LogLevel.Debug) {
            return;
        }

        (console).log(chalk.gray(message));
    }

    public error(message:string) {
        if ((this.logLevel & LogLevel.Error) !== LogLevel.Error) {
            return;
        }

        (console).log(chalk.red(message));
    }

    public info(message:string) {
        if ((this.logLevel & LogLevel.Info) !== LogLevel.Info) {
            return;
        }

        (console).log(message);
    }
}
