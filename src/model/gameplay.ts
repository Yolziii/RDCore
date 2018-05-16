/*export const enum DicePlaceType {
    Nowhere = "Nowhere",
    Table = "Table",
    Slot = "Slot",
    CardField = "CardField",
}*/

import {Dice, IDice} from "./Dices";
import {CellType} from "./Cells";
import {ICard} from "./Cards";

export interface IPlayer {
    readonly id: number;
    readonly name: string;
}

export interface ITeam {
    readonly color: number;
    readonly totalPlayers: number;
}



export interface IRoundController {
    throw();

    selectHoldPlace(index:number);
    selectThrowDice(index:number);

    fillCell(card:ICard, type:CellType);
}

export interface ICommand {
    execute();
}
