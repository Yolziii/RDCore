import {
    IRound, IRoundPlayerFillObserver, IRoundPlayerFreeObserver, IRoundPlayerHoldObserver,
    IRoundPlayerThrowObserver, SingleRound
} from "../../core/Rounds";
import {CellType} from "../../core/Cells";
import {IRoundState} from "./SingleRoundState";

export interface IRoundView {
    init(controller:RoundController);

    activate(model:IRound);
    draw();
    sleep();
    exit();

    enableThrowButton();
    disableThrowButton();

    enableCells();
    disableCells();
}

export class RoundController implements IRoundPlayerThrowObserver, IRoundPlayerFillObserver, IRoundPlayerHoldObserver, IRoundPlayerFreeObserver {
    private state:IRoundState;
    private model:SingleRound;
    private view:IRoundView;

    constructor(state:IRoundState, view:IRoundView) {
        this.state = state;
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

    public sleep() {
        this.view.sleep();
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

        if (this.model.getCard().hasCell(type)) {
            this.model.fillCell(type);
        }
    }

    public undoFillCell() {
        // TODO: Отмена заполнения последней ячейки (только до следующего броска)
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

    public onPlayerThrow() {
        if (this.model.throwsLeft === 0) {
            this.view.disableThrowButton();
        }
        this.view.enableCells();
    }

    public onPlayerFill() {
        if (this.model.finished) {
            this.view.draw();
            this.view.disableCells();
            this.view.disableThrowButton();

            this.state.finishRound();
        } else {
            this.view.draw();
            this.view.disableCells();
            this.view.enableThrowButton();
        }
    }

    public onPlayerHold() {
        this.view.draw();
    }

    public onPlayerFree() {
        this.view.draw();
    }
}
