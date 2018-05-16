/*export const enum DicePlaceType {
    Nowhere = "Nowhere",
    Table = "Table",
    Slot = "Slot",
    CardField = "CardField",
}*/

import {CellType} from "./Cells";
import {ICard} from "./Cards";

export interface ITeam {
    readonly color: number;
    readonly totalPlayers: number;
}
