import {CellType} from "../cells/CellType";
import {IDice} from "../dice/IDice";
import {ICard} from "../Card";
import {IRoundObserverSubject} from "./IRoundObserverSubject";

/** Игрок, который участвует в игровом раунде */
export interface IRoundPlayer extends IRoundObserverSubject {
    /** Сколько бросков осталось у игрока */
    readonly throwsLeft: number;

    /** Кости, брошенные игроком последний раз */
    readonly throwed:IDice;

    /** Сколько слотов есть у игрока для сбора кубиков */
    readonly diceSize:number;

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

    /** Текущая комбинация костей (миск из собранных и брошенных костей) */
    getMixedDice():IDice;

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

    /** Передает модели брошенные кости */
    setThrowedDice(dice:IDice);

    /** Определить текущую карточку */
    selectCard(index:number); // Если карт несколько, то API работает с активной

    /** Возвращает текущую карточку */
    getCard():ICard;

    /** Заполнить указанную ячейку текущей карточски текущей комбинацией */
    fillCell(type:CellType);
}
