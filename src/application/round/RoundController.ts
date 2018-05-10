import {Application} from "../Application";
import {
    IRound, IRoundPlayerFillObserver, IRoundPlayerFreeObserver, IRoundPlayerHoldObserver,
    IRoundPlayerThrowObserver, SingleRound
} from "../../core/Rounds";
import {CellType} from "../../core/Cells";

export interface IRoundView {
    init(controller:RoundController);

    activate(model:IRound);
    draw();
    exit();

    enableThrowButton();
    disableThrowButton();

    enableCells();
    disableCells();

}

export class RoundController implements IRoundPlayerThrowObserver, IRoundPlayerFillObserver, IRoundPlayerHoldObserver, IRoundPlayerFreeObserver {
    private app:Application;
    private model:SingleRound;
    private view:IRoundView;

    constructor(app:Application, view:IRoundView) {
        this.app = app;
        this.view = view;

        this.view.init(this);

    }

    public activate(model:SingleRound) {
        this.model = model;

        this.view.activate(model);
        this.view.disableCells();
        this.view.enableThrowButton();
        this.model.registerObserver(this);
    }

    public exit() {
        this.view.exit();
        this.model.unregisterObserver(this);
    }

    public throwPressed() {
        if (this.model.throwsLeft === 0) {
            return;
        }
        this.model.throwDice();
    }

    public fillCell(type:CellType) {
        if (!this.model.dice.isFull) {
            return;
        }

        this.model.fillCell(type);
    }

    public holdDie(index:number) {
        if (this.model.canHoldDie(index)) {
            this.model.holdDie(index);
        }
    }

    public freeDie(index:number) {
        if (this.model.canFreeDie(index)) {
            this.model.freeDie(index);
        }
    }

    public switchDie(index:number) {
        if (this.model.canFreeDie(index)) {
            this.model.freeDie(index);
        } else if (this.model.canHoldDie(index)) {
            this.model.holdDie(index);
        }
    }

    public onPlayerThrow() {
        if (this.model.throwsLeft === 0) {
            this.view.disableThrowButton();
        }
        this.view.enableCells();
    }

    public onPlayerFill() {
        this.view.draw();
        this.view.disableCells();
        this.view.enableThrowButton();
    }

    public onPlayerHold() {
        this.view.draw();
    }

    public onPlayerFree() {
        this.view.draw();
    }
}
