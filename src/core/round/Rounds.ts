import {IDice} from "../Dices";
import {ICard} from "../Cards";
import {CellType} from "../Cells";

export interface IRoundPlayer extends IRoundObserverSubject {
    /** Сколько бросков осталось у игрока */
    readonly throwsLeft: number;

    /** Текущая комбинация костей (миск из собранных и брошенных костей) */
    readonly dice:IDice;

    /** Кости, брошенные игроком последний раз */
    readonly throwed:IDice;

    /** Кости, собранные игроком */
    readonly holded:IDice;

    /** Сколько всего карточек есть у игрока */
    readonly totalCards:number;

    /** Индекс текущей активной карточки (начиная с 0) */
    readonly activeCardIndex:number;

    /** Заполнил ли игрок все свои карточки */
    readonly finished:boolean;

    /** Очков во всех карточках игрока */
    readonly score:number;

    /** Может ли игрок сохранить текущую кость */
    canHoldDie(index:number);

    /** Может ли игрок освободить текущую кость */
    canFreeDie(index:number);

    /** Сохранить текущую кость */
    holdDie(index:number);

    /** Освободить текущую кость */
    freeDie(index:number);

    /** Бросить кости */
    throwDice();

    /** Определить текущую карточку */
    setActiveCard(index:number); // Если карт несколько, то API работает с активной

    /** Возвращает текущую карточку */
    getCard():ICard;

    /** Заполнить указанную ячейку текущей карточски текущей комбинацией */
    fillCell(type:CellType);
}

export interface IRound extends IRoundPlayer, IRoundObserverSubject {
    readonly totalPlayers:number;
    readonly score:number;

    setActivePlayer(index:number);
    getPlayer():IRoundPlayer;
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
