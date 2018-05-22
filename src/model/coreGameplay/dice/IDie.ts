/** Один кубик */
import {DieType} from "./DieType";

export interface IDie {
    readonly type: DieType;
    readonly value?: number;
}
