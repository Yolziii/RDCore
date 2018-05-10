// tslint:disable-next-line:no-var-requires
const ansiEsc = require("ansi-escapes");

import {IMainScreenView, MainScreenController} from "../application/mainScreen/MainScreenController";
import {ATerminalView} from "./ATerminalView";
import {IKeyListener, TerminalAppView} from "./TerminalAppView";
import chalk from "chalk";

export class TerminalMainScreenView extends ATerminalView implements IMainScreenView, IKeyListener {
    private controller:MainScreenController;

    constructor() {
        super(0, 0);
    }

    public init(controller:MainScreenController) {
        this.controller = controller;
    }

    public activate() {
        TerminalAppView.instance.addObserver(this);
        this.draw();
    }

    public sleep() {
        TerminalAppView.instance.removeObserver(this);
    }

    public onKey(key:string) {
        if (key === "s") {
            this.controller.onSingleRound();
        }
    }

    public draw(): void {
        process.stdout.write(ansiEsc.clearScreen);

        const log = console.log;
        log("");

        this.x = 5;
        this.y = 0;
        this.startDraw();

        this.line("______                  _______ _");
        this.line("| ___ \\                | |  _  (_)");
        this.line("| |_/ /___  _   _  __ _| | | | |_  ___ ___");
        this.line("|    // _ \\| | | |/ _\` | | | | | |/ __/ _ \\");
        this.line("| |\\ \\ (_) | |_| | (_| | | |/ /| | (_|  __/");
        this.line("\\_| \\_\\___/ \\__, |\\__,_|_|___/ |_|\\___\\___|");
        this.line("             __/ |");
        this.line("            |___/");
        this.line("                ___ ___  _ __ ___");
        this.line("              / __/ _ \\| '__/ _ \\");
        this.line("             | (_| (_) | | |  __/");
        this.line("              \\___\\___/|_|  \\___|");

        this.x = 18;
        this.y = 15;
        this.startDraw();
        this.line(chalk.gray("|--------------|"));
        this.line(chalk.gray("| Single round |"));
        this.line(chalk.gray(`|      ${chalk.yellowBright("[S]")}     |`));
        this.line(chalk.gray("|--------------|"));
    }
}
