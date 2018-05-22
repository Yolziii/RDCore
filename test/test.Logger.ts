import * as assert from "assert";
import "mocha";
import {ConsoleLogger, Logger, LogLevel, StreamLogger} from "../src/util/Logger";
import chalk from "chalk";

// tslint:disable:no-var-requires
const MemoryStream = require("memory-stream");

// tslint:disable: no-bitwise

describe("Logger", () => {
    describe("LogLevel", () => {
        it("bit operation", () => {
            const logLevel = LogLevel.Debug | LogLevel.Info | LogLevel.Warning | LogLevel.Error;
            assert.equal(logLevel & LogLevel.Error, LogLevel.Error);
        });
    });

    describe("ConsoleLogger", () => {
        let backUpConsoleLog;
        let output;

        beforeEach(() => {
            backUpConsoleLog = console.log;
            output = "";
            console.log = (msg) => {
                output += msg;
            };
        });

        afterEach(() => {
            console.log = backUpConsoleLog;
        });

        it("console.log itself", () => {
           (console).log("test");
           assert.equal(output, "test");
        });

        it("ConsoleLogger.debug() by default", () => {
            const logger = new ConsoleLogger();
            logger.debug("test");

            assert.equal(output, chalk.gray("test"));
        });

        it("no debug messages", () => {
            const logger = new ConsoleLogger();
            logger.setLevel(LogLevel.Warning & LogLevel.Info & LogLevel.Error);
            logger.debug("test");

            assert.equal(output, "");
        });

        it("just ConsoleLogger.debug()", () => {
            const logger = new ConsoleLogger();
            logger.setLevel(LogLevel.Debug);
            logger.debug("test");

            assert.equal(output, chalk.gray("test"));
        });

        it("ConsoleLogger.info() by default", () => {
            const logger = new ConsoleLogger();
            logger.info("test");

            assert.equal(output, "test");
        });

        it("no info messages", () => {
            const logger = new ConsoleLogger();
            logger.setLevel(LogLevel.Warning & LogLevel.Debug & LogLevel.Error);
            logger.info("test");

            assert.equal(output, "");
        });

        it("just ConsoleLogger.info()", () => {
            const logger = new ConsoleLogger();
            logger.setLevel(LogLevel.Info);
            logger.info("test");

            assert.equal(output, "test");
        });

        it("ConsoleLogger.warning() by default", () => {
            const logger = new ConsoleLogger();
            logger.warning("test");

            assert.equal(output, chalk.yellow("test"));
        });

        it("no warning messages", () => {
            const logger = new ConsoleLogger();
            logger.setLevel(LogLevel.Info & LogLevel.Debug & LogLevel.Error);
            logger.warning("test");

            assert.equal(output, "");
        });

        it("just ConsoleLogger.warning()", () => {
            const logger = new ConsoleLogger();
            logger.setLevel(LogLevel.Warning);
            logger.warning("test");

            assert.equal(output, chalk.yellow("test"));
        });

        it("ConsoleLogger.error() by default", () => {
            const logger = new ConsoleLogger();
            logger.error("test");

            assert.equal(output, chalk.red("test"));
        });

        it("no error messages", () => {
            const logger = new ConsoleLogger();
            logger.setLevel(LogLevel.Info & LogLevel.Debug & LogLevel.Warning);
            logger.error("test");

            assert.equal(output, "");
        });

        it("just ConsoleLogger.warning()", () => {
            const logger = new ConsoleLogger();
            logger.setLevel(LogLevel.Error);
            logger.error("test");

            assert.equal(output, chalk.red("test"));
        });
    });

    describe("StreamLogger", () => {
        let stream;
        beforeEach(() => {
            stream = new MemoryStream();
        });

        it("debug() by default", () => {
            const logger = new StreamLogger(stream);
            logger.debug("test");

            assert.equal(stream.toString(), chalk.gray("test") + "\n");
        });

        it("no debug messages", () => {
            const logger = new StreamLogger(stream);
            logger.setLevel(LogLevel.Warning & LogLevel.Info & LogLevel.Error);
            logger.debug("test");

            assert.equal(stream.toString(), "");
        });

        it("just debug()", () => {
            const logger = new StreamLogger(stream);
            logger.setLevel(LogLevel.Debug);
            logger.debug("test");

            assert.equal(stream.toString(), chalk.gray("test") + "\n");
        });

        it("info() by default", () => {
            const logger = new StreamLogger(stream);
            logger.info("test");

            assert.equal(stream.toString(), "test" + "\n");
        });

        it("no info messages", () => {
            const logger = new StreamLogger(stream);
            logger.setLevel(LogLevel.Warning & LogLevel.Debug & LogLevel.Error);
            logger.info("test");

            assert.equal(stream.toString(), "");
        });

        it("just info()", () => {
            const logger = new StreamLogger(stream);
            logger.setLevel(LogLevel.Info);
            logger.info("test");

            assert.equal(stream.toString(), "test" + "\n");
        });

        it("warning() by default", () => {
            const logger = new StreamLogger(stream);
            logger.warning("test");

            assert.equal(stream.toString(), chalk.yellow("test") + "\n");
        });

        it("no warning messages", () => {
            const logger = new StreamLogger(stream);
            logger.setLevel(LogLevel.Info & LogLevel.Debug & LogLevel.Error);
            logger.warning("test");

            assert.equal(stream.toString(), "");
        });

        it("just warning()", () => {
            const logger = new StreamLogger(stream);
            logger.setLevel(LogLevel.Warning);
            logger.warning("test");

            assert.equal(stream.toString(), chalk.yellow("test") + "\n");
        });

        it("error() by default", () => {
            const logger = new StreamLogger(stream);
            logger.error("test");

            assert.equal(stream.toString(), chalk.red("test") + "\n");
        });

        it("no error messages", () => {
            const logger = new StreamLogger(stream);
            logger.setLevel(LogLevel.Info & LogLevel.Debug & LogLevel.Warning);
            logger.error("test");

            assert.equal(stream.toString(), "");
        });

        it("just warning()", () => {
            const logger = new StreamLogger(stream);
            logger.setLevel(LogLevel.Error);
            logger.error("test");

            assert.equal(stream.toString(), chalk.red("test") + "\n");
        });
    });

    describe("Logger", () => {
        let backUpConsoleLog;
        let output;

        beforeEach(() => {
            Logger.clear();
            Logger.add(new ConsoleLogger());

            backUpConsoleLog = console.log;
            output = "";
            console.log = (msg) => {
                output += msg;
            };
        });

        afterEach(() => {
            console.log = backUpConsoleLog;
        });

        it("Logger.debug()", () => {
            Logger.debug("test");
            assert.equal(output,chalk.gray("test"));
        });

        it("Logger.info()", () => {
            Logger.info("test");
            assert.equal(output,"test");
        });

        it("Logger.warning()", () => {
            Logger.warning("test");
            assert.equal(output,chalk.yellow("test"));
        });

        it("Logger.error()", () => {
            Logger.error("test");
            assert.equal(output,chalk.red("test"));
        });

        it("format()", () => {
            Logger.error("test %s", "test2");
            assert.equal(output,chalk.red("test test2"));
        });
    });
});
