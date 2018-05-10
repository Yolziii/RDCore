import {Dice, DieType, IDice, IDie, NullDice} from "./Dices";
import {ICard} from "./Cards";
import {CellType, ICell} from "./Cells";
import {Config} from "./Config";
import {Thrower} from "./round/Thrower";

export interface IRoundPlayer extends IRoundObserverSubject {
    readonly throwsLeft: number;
    readonly dice:IDice;

    readonly throwed:IDice;
    readonly holded:IDice;

    readonly totalCards:number;

    canHoldDie(index:number);
    canFreeDie(index:number);

    holdDie(index:number);
    freeDie(index:number);

    throwDice();

    setActiveCard(index:number); // Если карт несколько, то API работает с активной
    getCard():ICard;
    fillCell(type:CellType);
}

export interface ISingleCardPlayer {
    getCard():ICard;
    fillCell(type:CellType);
}

export interface IRound extends IRoundPlayer, IRoundObserverSubject {
    readonly finished: boolean;
    readonly totalPlayers:number;

    setActivePlayer(index:number);
    getPlayer():IRoundPlayer;
}

export class SingleRound implements IRound {
    public readonly totalPlayers:number = 1;
    public readonly totalCards:number = 1;

    private player:RoundPlayerCard1;

    constructor(player:RoundPlayerCard1) {
        this.player = player;
    }

    public getPlayer():IRoundPlayer {
        return this.player;
    }

    public getCard():ICard {
        return this.player.getCard();
    }

    public setActivePlayer(index:number) {/**/}

    public get finished() {
        const card:ICard = this.player.getCard();
        return card.finished;
    }

    public get throwsLeft(): number {return this.player.throwsLeft;}
    public get dice():IDice {return this.player.dice;}

    public get throwed():IDice {return this.player.throwed;}
    public get holded():IDice {return this.player.holded;}

    public canHoldDie(index:number):boolean {return this.player.canHoldDie(index);}
    public canFreeDie(index:number):boolean {return this.player.canFreeDie(index);}

    public holdDie(index:number) {return this.player.holdDie(index);}
    public freeDie(index:number) {return this.player.freeDie(index);}

    public throwDice() {this.player.throwDice();}
    public fillCell(type:CellType) {
        this.player.fillCell(type);
    }

    public registerObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver) {
        this.player.registerObserver(observer);
    }

    public unregisterObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver) {
        this.player.unregisterObserver(observer);
    }

    public setActiveCard() {/**/}

}

export interface IRoundPlayerThrowObserver {
    onPlayerThrow();
}

export interface IRoundPlayerHoldObserver {
    onPlayerHold();
}

export interface IRoundPlayerFreeObserver {
    onPlayerFree();
}

export interface IRoundPlayerFillObserver {
    onPlayerFill();
}

export interface IRoundObserverSubject {
    registerObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver);
    unregisterObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver);
}

export class RoundPlayerObserverSubject implements IRoundObserverSubject {
    private throwObservers:IRoundPlayerThrowObserver[] = [];
    private holdObservers:IRoundPlayerHoldObserver[] = [];
    private freeObservers:IRoundPlayerFreeObserver[] = [];
    private fillObservers:IRoundPlayerFillObserver[] = [];

    public registerObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver) {
        if ("onPlayerThrow" in observer) {
            this.throwObservers.push(observer as IRoundPlayerThrowObserver);
        }
        if ("onPlayerHold" in observer) {
            this.holdObservers.push(observer as IRoundPlayerHoldObserver);
        }
        if ("onPlayerFree" in observer) {
            this.freeObservers.push(observer as IRoundPlayerFreeObserver);
        }
        if ("onPlayerFill" in observer) {
            this.fillObservers.push(observer as IRoundPlayerFillObserver);
        }
    }

    public unregisterObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver) {
        if ("onPlayerThrow" in observer) {
            const i = this.throwObservers.indexOf(observer);
            if (i !== -1) {
                this.throwObservers.splice(i, 1);
            }
        }
        if ("onPlayerHold" in observer) {
            const i = this.holdObservers.indexOf(observer);
            if (i !== -1) {
                this.holdObservers.splice(i, 1);
            }
        }
        if ("onPlayerFree" in observer) {
            const i = this.freeObservers.indexOf(observer);
            if (i !== -1) {
                this.freeObservers.splice(i, 1);
            }
        }
        if ("onPlayerFill" in observer) {
            const i = this.fillObservers.indexOf(observer);
            if (i !== -1) {
                this.fillObservers.splice(i, 1);
            }
        }
    }

    public onPlayerThrow() {
        for (const observer of this.throwObservers) {
            observer.onPlayerThrow();
        }
    }

    public onPlayerHold() {
        for (const observer of this.holdObservers) {
            observer.onPlayerHold();
        }
    }

    public onPlayerFree() {
        for (const observer of this.freeObservers) {
            observer.onPlayerFree();
        }
    }

    public onPlayerFill() {
        for (const observer of this.fillObservers) {
            observer.onPlayerFill();
        }
    }
}

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
