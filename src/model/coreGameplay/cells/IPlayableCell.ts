import {IDice} from "../dice/IDice";
import {ICell} from "./ICell";

/** Играбельная ячейка, в которую игрок может положить комбинацию кубиков */
export interface IPlayableCell extends ICell {
    readonly isFull: boolean;
    readonly dice: IDice;

    fill(dice: IDice): void;
    valueFor(dice: IDice):number;
}
