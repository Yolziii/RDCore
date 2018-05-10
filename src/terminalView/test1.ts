import chalk from "chalk";
// tslint:disable-next-line:no-var-requires
const readline = require("readline");
// tslint:disable-next-line:no-var-requires
const ansiEsc = require("ansi-escapes");
import {TerminalThrowButton} from "./ThrowButton";

const log = console.log;

process.stdout.write(ansiEsc.clearScreen);
log("");
// Combine styled and normal strings
log(chalk.blue("Hello") + " World" + chalk.red("!"));

// Compose multiple styles using the chainable API
log(chalk.blue.bgRed.bold("Hello world!"));

// Pass in multiple arguments
log(chalk.blue("Hello", "World!", "Foo", "bar", "biz", "baz"));

// Nest styles
log(chalk.red("Hello", chalk.underline.bgBlue("world") + "!"));

// Nest styles of the same type even (color, underline, background)
log(chalk.green(
    "I am a green line " +
    chalk.blue.underline.bold("with a blue substring") +
    " that becomes green again!",
));

readline.cursorTo(process.stdout, 10, -1);
// process.stdout.write(ansiEsc.cursorSavePosition);

// ES2015 template literal
log(`
CPU: ${chalk.red("90%")}
RAM: ${chalk.green("40%")}
DISK: ${chalk.yellow("70%")}
`);

// Use RGB colors in terminal emulators that support it.
log(chalk.keyword("orange")("Yay for orange colored text!"));
log(chalk.rgb(123, 45, 67).underline("Underlined reddish color"));
log(chalk.hex("#DEADED").bold("Bold gray!"));

const throwButton: TerminalThrowButton = new TerminalThrowButton(20, 1 );
throwButton.draw();



(function wait() {
    if (true) {
        setTimeout(wait, 1000);
    }
})();
