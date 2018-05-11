import {ATerminalView} from "../ATerminalView";
import {TermninalCellView} from "./TerminalCellView";

// tslint:disable-next-line:no-var-requires
const ansiEsc = require("ansi-escapes");

import {IRoundView, RoundController} from "../../client/round/RoundController";
import {
    IRound, IRoundPlayerFillObserver, IRoundPlayerFreeObserver, IRoundPlayerHoldObserver,
    IRoundPlayerThrowObserver
} from "../../core/Rounds";
import chalk from "chalk";
import {IDictionary} from "../../util/Dictionaries";
import {CellType, ICell} from "../../core/Cells";
import {ICard} from "../../core/Cards";
import {TerminalThrowButton} from "./TerminalThrowButton";
import {IKeyListener, TerminalAppView} from "../TerminalAppView";
import {TerminalDieView} from "./TerminalDieView";
import {Config} from "../../core/Config";
import {DieType, IDice} from "../../core/Dices";

const keyForType:IDictionary<string> = {
    [CellType.Ones]: "1",
    [CellType.Twos]: "2",
    [CellType.Threes]: "3",
    [CellType.Fours]: "4",
    [CellType.Fives]: "5",
    [CellType.Sixes]: "6",
    [CellType.Kind3]: "q",
    [CellType.Kind4]: "k",
    [CellType.FullHouse]: "f",
    [CellType.SmallStraight]: "s",
    [CellType.LargeStraight]: "l",
    [CellType.RoyalDice]: "r",
    [CellType.Chance]: "c",
};

const keyForHold:string[] = ["y", "u", "i", "o", "p"];
const keyForFree:string[] = ["n", "m", ",", ".", "/"];

const typeForKey:IDictionary<CellType> = {};
for (const type in keyForType) {
    if (!keyForType.hasOwnProperty(type)) {
        continue;
    }
    const key = keyForType[type];
    typeForKey[key] = type as CellType;
}

const CARD_X = 0;
const CARD_Y = 0;

const DICE_X = 30;
const THROWED_DICE_Y = 1;
const HOLDED_DICE_Y = 7;

export class TerminalSingleRoundView extends ATerminalView implements
        IRoundView, IRoundPlayerThrowObserver, IRoundPlayerHoldObserver, IRoundPlayerFreeObserver, IRoundPlayerFillObserver,
        IKeyListener {
    private controller:RoundController;
    private model:IRound;

    private throwButton:TerminalThrowButton;
    private cellViews:TermninalCellView[] = [];
    private throwedViews:TerminalDieView[] = [];
    private holdedViews:TerminalDieView[] = [];

    public init(controller:RoundController) {
        this.controller = controller;

        this.throwButton = new TerminalThrowButton(20, 20);
        for (let i = 0; i < Config.DefaultDiceSize; i++) {
            this.throwedViews.push(new TerminalDieView(DICE_X + i*7, THROWED_DICE_Y));
            this.holdedViews.push(new TerminalDieView(DICE_X + i*7, HOLDED_DICE_Y));
        }
    }

    public activate(model:IRound) {
        this.model = model;

        model.registerObserver(this);
        const self = this;

        initCells();

        process.stdout.write(ansiEsc.clearScreen);
        this.draw();

        TerminalAppView.instance.addObserver(this);

        // TODO: Выделить в TerminalCardView
        function initCells() {
            self.cellViews.length = 0;
            const card:ICard = model.getCard();
            let y = CARD_Y;
            for (const type in CellType) {
                if (!card.hasCell(type as CellType)) {
                    continue;
                }

                const cell:ICell = card.getCell(type as CellType);
                const cellView:TermninalCellView = new TermninalCellView(CARD_X, y);

                const key = (keyForType[cell.type] !== undefined) ? keyForType[cell.type] : "";
                cellView.init(key, cell);
                self.cellViews.push(cellView);
                y++;
            }
        }
    }

    public exit() {
        this.model.unregisterObserver(this);
        TerminalAppView.instance.removeObserver(this);
    }

    public onKey(key:string) {
        switch (key) {
            case " ":
                this.controller.throwPressed();
                break;

            default:
                if (typeForKey[key] != null) {
                    this.controller.fillCell(typeForKey[key]);
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
        for (const cellView of this.cellViews) {
            cellView.draw();
        }

        const throwed:IDice = this.model.throwed;
        for (let i = 0; i < throwed.max; i++) {
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
        for (let i = 0; i < holded.max; i++) {
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
    }

    public onPlayerThrow() {
        this.draw();
    }

    public onPlayerHold() {
        this.draw();
    }

    public onPlayerFree() {
        this.draw();
    }

    public onPlayerFill() {
        this.draw();
    }

    public enableThrowButton() {
        this.throwButton.enable();
    }

    public disableThrowButton() {
        this.throwButton.disable();
    }

    public enableCells() {
        for (const cellView of this.cellViews) {
            cellView.enable();
        }
    }

    public disableCells() {
        for (const cellView of this.cellViews) {
            cellView.disable();
        }
    }
}
