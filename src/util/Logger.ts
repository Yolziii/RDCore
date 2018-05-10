import chalk from "chalk";

export enum LoggerMessageType {

}

export class Logger {
    public static allow(...id:LoggerMessageType[]) {
        // TODO:
    }

    public static deny(...id:LoggerMessageType[]) {
        // TODO:
    }

    public static warning(message:string, id:LoggerMessageType = null) {
        Logger.log(chalk.yellow(message));
    }

    public static debug(message:string, id:LoggerMessageType = null) {
        Logger.log(message);
    }

    public static error(message:string, id:LoggerMessageType = null) {
        Logger.log(chalk.red(message));
    }

    private static log(msg:string) {
        const log = console.log;
        log(msg);
    }

    private static checkId(id:LoggerMessageType) {
        return true; // TODO:
    }
}
