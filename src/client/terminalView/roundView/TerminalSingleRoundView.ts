import {ATerminalView} from "../ATerminalView";

// tslint:disable-next-line:no-var-requires
const ansiEsc = require("ansi-escapes");

import {IRound, IRoundObserver, RoundEvent} from "../../../model/coreGameplay/round/Rounds";
import chalk from "chalk";
import {IDictionary} from "../../../util/Dictionaries";
import {CellType} from "../../../model/coreGameplay/Cells";
import {TerminalThrowButton} from "./TerminalThrowButton";
import {IKeyListener, TerminalAppView} from "../TerminalAppView";
import {TerminalDieView} from "./TerminalDieView";
import {Config} from "../../../model/Config";
import {DieType, IDice} from "../../../model/coreGameplay/Dices";
import {IRoundView, SingleRoundController} from "../../../app/round/SingleRoundController";
import {TerminalQuitButton} from "./TerminalQuitButton";
import {TerminalCardView} from "./TerminalCardView";

const keyForType:IDictionary<string> = {
    [CellType.Ones]: "1",
    [CellType.Twos]: "2",
    [CellType.Threes]: "3",
    [CellType.Fours]: "4",
    [CellType.Fives]: "5",
    [CellType.Sixes]: "6",
    [CellType.Kind3]: "j",
    [CellType.Kind4]: "k",
    [CellType.FullHouse]: "f",
    [CellType.SmallStraight]: "s",
    [CellType.LargeStraight]: "l",
    [CellType.RoyalDice]: "r",
    [CellType.Chance]: "c",
};

const keyForHold:string[] = ["y", "u", "i", "o", "p"];
const keyForFree:string[] = ["n", "m", ",", ".", "/"];

const keyForCards:string[] = ["[[A", "[[B", "[[C"]; // F1, F2, F3

const typeForKey:IDictionary<CellType> = {};
for (const type in keyForType) {
    if (!keyForType.hasOwnProperty(type)) {
        continue;
    }
    const key = keyForType[type];
    typeForKey[key] = type as CellType;
}

let DICE_X = 30;
const THROWED_DICE_Y = 1;
const HOLDED_DICE_Y = 7;

export class TerminalSingleRoundView extends ATerminalView implements IRoundView, IRoundObserver, IKeyListener {
    private controller:SingleRoundController;
    private model:IRound;

    private throwButton:TerminalThrowButton;
    private quitButton:TerminalQuitButton;

    private cardViews:TerminalCardView[];

    private throwedViews:TerminalDieView[] = [];
    private holdedViews:TerminalDieView[] = [];

    public init(controller:SingleRoundController) {
        this.controller = controller;

        this.throwButton = new TerminalThrowButton(20, 20);
        this.quitButton = new TerminalQuitButton(1, 20);
    }

    public activate(model:IRound) {
        this.model = model;

        DICE_X = 30 * model.totalCards;

        this.throwedViews = [];
        this.holdedViews = [];
        for (let i = 0; i < Config.DefaultDiceSize; i++) {
            this.throwedViews.push(new TerminalDieView(DICE_X + i*7, THROWED_DICE_Y));
            this.holdedViews.push(new TerminalDieView(DICE_X + i*7, HOLDED_DICE_Y));
        }

        model.addObserver(this);
        const self = this;

        this.cardViews = [];
        for (let i = 0; i < model.getPlayer().totalCards; i++) {
            const cardView = new TerminalCardView(i * 30, 1, this.model, keyForType, i);
            this.cardViews.push(cardView);
        }
        this.model.selectCard(0);

        process.stdout.write(ansiEsc.clearScreen);
        this.draw();

        TerminalAppView.instance.addObserver(this);
    }

    public sleep() {
        TerminalAppView.instance.removeObserver(this);
    }

    public wakeup() {
        TerminalAppView.instance.addObserver(this);
    }

    public exit() {
        this.model.removeObserver(this);
        TerminalAppView.instance.removeObserver(this);
    }

    public onKey(key:string) {
        switch (key) {
            case " ":
                this.controller.throwPressed();
                break;

            case "q":
                this.controller.quit();
                break;

            default:
                if (typeForKey[key] != null) {
                    this.controller.fillCell(typeForKey[key]);
                } else if (keyForCards.indexOf(key) !== -1) {
                    const i = keyForCards.indexOf(key);
                    this.controller.selectCard(i);
                } else if ( key === "\u0008" ) {
                    this.controller.undoFillCell();
                } else {
                    const h = keyForHold.indexOf(key);
                    if (h !== -1) {
                        this.controller.holdDie(h);
                    } else {
                        const f = keyForFree.indexOf(key);
                        if (f !== -1) {
                            this.controller.freeDie(f);
                        }
                    }
                }

                break;
        }
    }

    public draw(): void {
        for (const cardViews of this.cardViews) {
            cardViews.draw();
        }

        const throwed:IDice = this.model.throwed;
        for (let i = 0; i < throwed.length; i++) {
            if (throwed.hasAt(i)) {
                this.throwedViews[i].init(throwed.getFrom(i));
            } else {
                this.throwedViews[i].init({type:DieType.Empty});
            }
            this.throwedViews[i].draw();

            const X = DICE_X + 1 + i * 7;
            if (throwed.hasAt(i)) {
                this.place(chalk.yellowBright(`[${keyForHold[i].toUpperCase()}]`), X, THROWED_DICE_Y+3);
            } else {
                this.place(chalk.gray(`[${keyForHold[i].toUpperCase()}]`), X, THROWED_DICE_Y+3);
            }
        }

        const holded:IDice = this.model.holded;
        for (let i = 0; i < holded.length; i++) {
            if (holded.hasAt(i)) {
                this.holdedViews[i].init(holded.getFrom(i));
            } else {
                this.holdedViews[i].init({type:DieType.Empty});
            }
            this.holdedViews[i].draw();

            const X = DICE_X + 1 + i * 7;
            if (holded.hasAt(i)) {
                this.place(chalk.yellowBright(`[${keyForFree[i].toUpperCase()}]`), X, HOLDED_DICE_Y+3);
            } else {
                this.place(chalk.gray(`[${keyForFree[i].toUpperCase()}]`), X, HOLDED_DICE_Y+3);
            }
        }

        this.throwButton.init(this.model.throwsLeft);
        this.throwButton.draw();

        this.quitButton.draw();
    }

    public enableThrowButton() {
        this.throwButton.enable();
    }

    public disableThrowButton() {
        this.throwButton.disable();
    }

    public enableCells() {
        for (const cardViews of this.cardViews) {
            cardViews.enableCells();
        }
    }

    public disableCells() {
        for (const cardViews of this.cardViews) {
            cardViews.disableCells();
        }
    }

    public onRoundEvent(event:RoundEvent) {
        this.draw();
    }
}
