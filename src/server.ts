import {ServerTransport} from "./server/ServerTransport";
import {Logger} from "./util/logger/Logger";
import {ConsoleLogger} from "./util/logger/ConsoleLogger";
import {LogLevel} from "./util/logger/LogLevel";

const consoleLogger = new ConsoleLogger();
// consoleLogger.setLevel(LogLevel.Error | LogLevel.Warning | LogLevel.Info);
Logger.add(consoleLogger);

const serverTransport = new ServerTransport(80);
serverTransport.listen();
