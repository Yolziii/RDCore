import {LogLevel} from "./LogLevel";

export interface ILogger {
    setLevel(level:LogLevel);
    warning(message:string);
    debug(message:string);
    error(message:string);
    info(message:string);
}
