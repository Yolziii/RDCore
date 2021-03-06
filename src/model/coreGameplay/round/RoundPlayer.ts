import {Thrower} from "./Thrower";
import {Config} from "../../Config";
import {CellType} from "../cells/CellType";
import {Dice} from "../dice/Dice";
import {IDice} from "../dice/IDice";
import {IRoundObserverSubject} from "./IRoundObserverSubject";
import {IRoundPlayer} from "./IRoundPlayer";
import {ICard} from "../Card";
import {IRoundObserver} from "./IRoundObserver";
import {RoundEventType} from "./RoundEventType";
import {RoundEventIndex} from "./events/RoundEventIndex";
import {RoundEventFillCell} from "./events/RoundEventFillCell";
import {RoundEventThrowedDice} from "./events/RoundEventThrowedDice";
import {RoundEvent} from "./events/RoundEvent";
import {Logger} from "../../../util/logger/Logger";

export class RoundPlayer implements IRoundPlayer, IRoundObserverSubject {
    private _cards:ICard[] = [];
    private _currentCard:ICard;
    private _activeCardIndex:number = 0;

    private _throwsLeft:number = 0;
    private _holdedDice:IDice = new Dice();
    private _throwedDice:IDice = new Dice();
    private _mixedDice:IDice = new Dice();

    private _observers:IRoundObserver[] = [];
    private _thrower:Thrower;

    constructor(thrower:Thrower, ...cards:ICard[]) {
        this._throwsLeft = Config.DefaultThrows;

        this._thrower = thrower;
        thrower.linkRoundPlayer(this);

        this._cards = cards;
        this._currentCard = cards[0];
    }

    public get totalCards() {
        return this._cards.length;
    }

    public get throwsLeft(): number {
        return this._throwsLeft;
    }

    public get diceSize():number {
        return Config.DefaultDiceSize;
    }

    public get activeCardIndex():number {
        return this._activeCardIndex;
    }

    public get throwed():IDice {
        return this._throwedDice;
    }

    public get holded():IDice {
        return this._holdedDice;
    }

    public getMixedDice():IDice {
        this._mixedDice.clear();
        for (let i=0; i<Config.DefaultDiceSize; i++) {  // TODO: Возможность изменения количества собираемых и учитываемых костей
            if (this._holdedDice.hasAt(i)) {
                this._mixedDice.put(this._holdedDice.getFrom(i));
            }
            if (this._throwedDice.hasAt(i)) {
                this._mixedDice.put(this._throwedDice.getFrom(i));
            }
        }
        return this._mixedDice;
    }

    public canHoldDie(index:number):boolean {
        return this._throwedDice.hasAt(index);
    }

    public canFreeDie(index:number):boolean {
        return this._holdedDice.hasAt(index);
    }

    public holdDie(index:number) {
        this._holdedDice.put(this._throwedDice.popFrom(index));

        this.dispatch(new RoundEventIndex(RoundEventType.Hold, index));
    }

    public freeDie(index:number) {
        this._throwedDice.put(this._holdedDice.popFrom(index));

        this.dispatch(new RoundEventIndex(RoundEventType.Free, index));
    }

    public getCard():ICard {
        return this._currentCard;
    }

    public fillCell(type:CellType) {
        Logger.info(`fillCell(${type})`);
        this._currentCard.fillCell(type, this.getMixedDice());
        this._throwsLeft = Config.DefaultThrows; // TODO: Возможность изменения количества попыток

        this._throwedDice.clear();
        this._holdedDice.clear();

        this.dispatch(new RoundEventFillCell(RoundEventType.FillCell, type));
    }

    public throwDice() {
        this._thrower.throwTemplate();
    }

    public setThrowedDice(dice:IDice) {
        this._throwsLeft--;
        if ( this._throwsLeft < 0) {
            // TODO: Исключение
        }

        this._throwedDice = dice;
        this.dispatch(new RoundEventThrowedDice(this._throwedDice));
    }

    public selectCard(index:number) {
        this._activeCardIndex = index;
        this._currentCard = this._cards[index];

        this.dispatch(new RoundEventIndex(RoundEventType.SelectCard, index));
    }

    public get finished():boolean {
        for(const card of this._cards) {
            if (!card.finished) {
                return false;
            }
        }
        return true;
    }

    public get score():number {
        let res = 0;
        for(const card of this._cards) {
            res += card.getCell(CellType.ServiceFinalScore).value;
        }
        return res;
    }

    public addObserver(observer:IRoundObserver) {
        if (this._observers.indexOf(observer) === -1) {
            this._observers.push(observer);
        }
    }

    public removeObserver(observer:IRoundObserver) {
        const index = this._observers.indexOf(observer);
        if (index !== -1) {
            this._observers.splice(index, 1);
        }
    }

    private dispatch(event:RoundEvent) {
        for (const observer of this._observers) {
            observer.onRoundEvent(event);
        }
    }
}
