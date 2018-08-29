import {ATerminalView} from "./ATerminalView";
import {IKeyListener, TerminalAppView} from "./TerminalAppView";
import chalk from "chalk";
import {IResultScreenController} from "../controllers/resultScreen/IResultScreenController";
import {IResultScreenView} from "../controllers/resultScreen/IResultScreenView";
import {IRound} from "../../../model/coreGameplay/round/IRound";

// tslint:disable-next-line:no-var-requires
const ansiEsc = require("ansi-escapes");

export class TerminalRoundResutScreenView extends ATerminalView implements IResultScreenView, IKeyListener {
    private controller:IResultScreenController;
    private model:IRound;

    constructor() {
        super(0, 0);
    }

    public init(controller:IResultScreenController) {
        this.controller = controller;
    }

    public activate(model:IRound) {
        this.model = model;
        TerminalAppView.instance.addObserver(this);
        this.draw();
    }

    public sleep() {
        TerminalAppView.instance.removeObserver(this);
    }

    public onKey(key:string) {
        if (key === "q") {
            this.controller.onClose();
        }
    }

    public draw(): void {
        process.stdout.write(ansiEsc.clearScreen);

        const log = console.log;
        log("");

        this.x = 12;
        this.y = 6;
        this.startDraw();

        this.line("You finished the round!");
        this.line("Your score: " + this.model.score);

        this.x = 18;
        this.y = 15;
        this.startDraw();
        this.line(chalk.gray("|------------|"));
        this.line(chalk.gray("|    Quit    |"));
        this.line(chalk.gray(`|    ${chalk.yellowBright("[Q]")}     |`));
        this.line(chalk.gray("|------------|"));
    }
}
