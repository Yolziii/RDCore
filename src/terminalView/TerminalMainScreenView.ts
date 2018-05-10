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

        this.x = 15;
        this.y = 8;
        this.startDraw();
        this.line(chalk.gray("|----------------|"));
        this.line(chalk.gray("|  Single round  |"));
        this.line(chalk.gray("|       [S]      |"));
        this.line(chalk.gray("|----------------|"));
    }
}
