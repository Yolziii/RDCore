import {IPlayableCell} from "../IPlayableCell";
import {APlayableCellDecorator} from "./APlayableCellDecorator";
import {IDice} from "../../dice/IDice";

export class MultiplierCellDecorator extends APlayableCellDecorator {
    private multiple:number;

    constructor(cell:IPlayableCell, multiple:number) {
        super(cell);
        this.multiple = multiple;
    }

    public valueFor(dice: IDice):number {
        return this.cell.valueFor(dice) * this.multiple;
    }

    public get value():number {
        return this.cell.value * this.multiple;
    }
}
