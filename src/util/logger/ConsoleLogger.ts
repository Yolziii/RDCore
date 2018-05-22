import chalk from "chalk";
import {ILogger} from "./ILogger";
import {LogLevel} from "./LogLevel";

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
