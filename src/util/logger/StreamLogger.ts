import chalk from "chalk";
import {ILogger} from "./ILogger";
import {LogLevel} from "./LogLevel";

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
