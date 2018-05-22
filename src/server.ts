import {ServerTransport} from "./server/ServerTransport";
import {ClientsRepository} from "./server/ClientsRepository";
import {ConsoleLogger, Logger, LogLevel} from "./util/Logger";

// tslint:disable: no-bitwise

const consoleLogger = new ConsoleLogger();
consoleLogger.setLevel(LogLevel.Error | LogLevel.Warning | LogLevel.Info);
Logger.add(consoleLogger);

const repository = new ClientsRepository();

const serverTransport = new ServerTransport(80, repository);
serverTransport.listen();
