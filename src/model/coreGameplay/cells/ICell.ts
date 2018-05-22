import {CellType} from "./CellType";

/** Ячейка, из которых состоит карточка игрока */
export interface ICell {
    /** Вид ячейки */
    readonly type: CellType;

    /** Сколько очков дает ячейка */
    readonly value: number;
}
