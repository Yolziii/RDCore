import {IRound, IRoundObserver, RoundEvent, RoundEventType} from "../../model/coreGameplay/round/Rounds";
import {CellType} from "../../model/coreGameplay/Cells";
import {IRoundState} from "./SingleRoundState";
import {SingleRound} from "../../model/coreGameplay/round/SingleRound";
import {ICard} from "../../model/coreGameplay/Cards";

export interface IRoundView {
    init(controller:SingleRoundController);

    activate(model:IRound);
    draw();
    exit();

    enableThrowButton();
    disableThrowButton();

    enableCells();
    disableCells();
}

export class SingleRoundController implements IRoundObserver {
    private state:IRoundState;
    private model:IRound;
    private view:IRoundView;

    constructor(state:IRoundState, view:IRoundView) {
        this.state = state;
        this.view = view;

        this.view.init(this);
    }

    public activate(model:IRound) {
        this.model = model;

        this.view.activate(model);
        this.view.disableCells();
        this.view.enableThrowButton();
        this.model.addObserver(this);
    }

    public exit() {
        this.view.exit();
        this.model.removeObserver(this);
    }

    public throwPressed() {
        if (this.model.throwsLeft === 0) {
            return;
        }
        this.model.throwDice();
    }

    public fillCell(type:CellType) {
        if (!this.model.getMixedDice().isFull) {
            return;
        }

        const card:ICard = this.model.getCard();
        if (card.hasCell(type)) {
            if (card.getCellPlayable(type).isFull) {
                return;
            }
            this.model.fillCell(type);
        }
    }

    public undoFillCell() {
        // TODO: Отмена заполнения последней ячейки (только до следующего броска)
    }

    public selectCard(index:number) {
        if (this.model.activeCardIndex !== index) {
            this.model.selectCard(index);
        }
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

    public quit() {
        this.state.quitRound();
    }

    public onRoundEvent(event:RoundEvent) {
        switch (event.type) {
            case RoundEventType.Throw:
                this.onPlayerThrow();
                break;

            case RoundEventType.FillCell:
                this.onPlayerFill();
                break;
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
}
