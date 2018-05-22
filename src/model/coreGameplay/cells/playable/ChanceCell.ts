import {CellType} from "../CellType";
import {IPlayableCell} from "../IPlayableCell";
import {APlayableCell} from "../APlayableCell";
import {IDice} from "../../dice/IDice";
import {IDie} from "../../dice/IDie";

export class ChanceCell extends APlayableCell implements IPlayableCell {
    constructor() {
        super();
        this.type = CellType.Chance;
    }

    public get value(): number {
        return this.valueFor(this.cellDice);
    }

    public valueFor(dice: IDice):number {
        let res = 0;
        for (let i = 0; i < dice.total; i++) {
            const die: IDie = dice.getFrom(i);
            res += die.value;
        }
        return res;
    }
}
