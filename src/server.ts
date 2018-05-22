import {ServerTransport} from "./server/ServerTransport";
import {ConsoleLogger, Logger, LogLevel} from "./util/Logger";

const consoleLogger = new ConsoleLogger();
// consoleLogger.setLevel(LogLevel.Error | LogLevel.Warning | LogLevel.Info);
Logger.add(consoleLogger);

const serverTransport = new ServerTransport(80);
serverTransport.listen();
