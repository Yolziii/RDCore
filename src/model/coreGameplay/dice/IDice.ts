import {ISerializable} from "../../../app/ISerializable";
import {IDie} from "./IDie";

/** Набор кубиков */
export interface IDice extends ISerializable {
    readonly length: number;
    readonly total: number;
    readonly isFull: boolean;

    put(die: IDie): void;
    putTo(die: IDie, index: number): void;
    popFrom(index:number): IDie;
    getFrom(index:number): IDie;
    hasAt(index:number):boolean;

    clear();
}
