import {CellType} from "../CellType";
import {APlayableCell} from "../APlayableCell";
import {IDice} from "../../dice/IDice";
import {IDie} from "../../dice/IDie";
import {DieType} from "../../dice/DieType";

export class NumberCell extends APlayableCell {
    private cellValue: number;

    constructor(type: CellType, value: number) {
        super();
        this.type = type;
        this.cellValue = value;
    }

    public get value(): number {
        return this.valueFor(this.cellDice);
    }

    public valueFor(dice: IDice):number {
        let res = 0;
        for (let i = 0; i < dice.total; i++) {
            const die: IDie = dice.getFrom(i);
            if ((die.type === DieType.Value && die.value === this.cellValue) ||
                die.type === DieType.Joker) {
                res += this.cellValue;
            }
        }
        return res;
    }
}
