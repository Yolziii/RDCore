import {
    IRoundPlayer, IRoundPlayerFillObserver, IRoundPlayerFreeObserver, IRoundPlayerHoldObserver,
    IRoundPlayerThrowObserver, ISingleCardPlayer, RoundPlayerObserverSubject
} from "./Rounds";
import {ICard} from "../Cards";
import {Dice, IDice} from "../Dices";
import {Config} from "../Config";
import {CellType} from "../Cells";
import {Thrower} from "./Thrower";

export class RoundPlayerCard1 implements IRoundPlayer, ISingleCardPlayer {
    public readonly totalCards:number = 1;

    private _throwsLeft:number = 0;
    private _holdedDice:IDice = new Dice();
    private _throwedDice:IDice = new Dice();
    private _mixedDice:IDice = new Dice();
    private _card:ICard;

    private _observable:RoundPlayerObserverSubject = new RoundPlayerObserverSubject();
    private _thrower:Thrower;

    public init(card:ICard, thrower:Thrower) {
        this._throwsLeft = Config.DefaultThrows;
        this._card = card;
        this._thrower = thrower;
        thrower.linkRoundPlayer(this);
    }

    public get throwsLeft(): number {
        return this._throwsLeft;
    }

    public get throwed():IDice {
        return this._throwedDice;
    }

    public get holded():IDice {
        return this._holdedDice;
    }

    public get dice():IDice {
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
        this._observable.onPlayerHold();
    }

    public freeDie(index:number) {
        this._throwedDice.put(this._holdedDice.popFrom(index));
        this._observable.onPlayerFree();
    }

    public getCard():ICard {
        return this._card;
    }

    public fillCell(type:CellType) {
        this._card.fillCell(type, this.dice);
        this._throwsLeft = Config.DefaultThrows; // TODO: Возможность изменения количества попыток

        this._throwedDice.clear();
        this._holdedDice.clear();

        this._observable.onPlayerFill();
    }

    public throwDice() {
        this._throwsLeft--;
        if ( this._throwsLeft < 0) {
            // TODO: Исключение
        }

        this._thrower.throwTemplate();
        this._observable.onPlayerThrow();
    }

    public registerObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver) {
        this._observable.registerObserver(observer);
    }

    public unregisterObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver) {
        this._observable.unregisterObserver(observer);
    }

    public setActiveCard() {/**/}
}
