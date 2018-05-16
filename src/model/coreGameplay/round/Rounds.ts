import {IDice} from "../Dices";
import {ICard} from "../Cards";
import {CellType} from "../Cells";
import enumerate = Reflect.enumerate;

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

/** Отвечает за реализацию Наблюдателя для раунда */
export interface IRoundObserverSubject {
    addObserver(observer:IRoundObserver);
    removeObserver(observer:IRoundObserver);
}

export interface IRound extends IRoundPlayer {
    readonly totalPlayers:number;
    readonly score:number;

    setActivePlayer(index:number);
    getPlayer():IRoundPlayer;
}

export enum RoundEventType {
    Throw,
    Hold,
    Free,
    Fill,
    SelectCard,
    SelectPlayer,
    End
}

export class RoundEvent {
    public type:RoundEventType;

    constructor(type:RoundEventType) {
        this.type = type;
    }
}

export class RoundEventThrow extends RoundEvent {
    public dice:IDice;

    constructor(dice:IDice) {
        super(RoundEventType.Throw);
        this.dice = dice;
    }
}

export class RoundEventIndex extends RoundEvent {
    public index: number;

    constructor(type:RoundEventType, index: number) {
        super(type);
        this.index = index;
    }
}

export interface IRoundObserver {
    onRoundEvent(event:RoundEvent);
}
