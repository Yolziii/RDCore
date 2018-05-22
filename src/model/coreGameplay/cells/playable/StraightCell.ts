import {CellType} from "../CellType";
import {IPlayableCell} from "../IPlayableCell";
import {APlayableCell} from "../APlayableCell";
import {IDice} from "../../dice/IDice";
import {IDie} from "../../dice/IDie";
import {DieType} from "../../dice/DieType";

export class StraightCell extends APlayableCell implements IPlayableCell {
    private static compare(a: number, b: number): number {
        if (a === b) {
            return 0;
        }
        return a > b ? 1 : -1;
    }

    public total: number;
    public cost: number;

    constructor(type: CellType, cost: number, total: number) {
        super();
        this.type = type;
        this.cost = cost;
        this.total = total;
    }

    public get value(): number {
        return this.valueFor(this.cellDice);
    }

    public valueFor(dice: IDice):number {
        const values: number[] = [];
        let jokers = 0;
        for (let i = 0; i < dice.total; i++) {
            const die: IDie = dice.getFrom(i);
            if (die.type === DieType.Value) {
                values[i] = die.value;
            } else {
                if (die.type === DieType.Joker) {
                    jokers++;
                }
                values[i] = 0;
            }
        }

        values.sort(StraightCell.compare);
        let count = 1;
        for (let i = 1; i < values.length; i++) {
            let sequence = values[i] === values[i - 1] + 1;
            if (!sequence && jokers > 0) {
                sequence = true;
                jokers--;
            }
            if (sequence) {
                count++;
                if (count === this.total) {
                    return this.cost;
                }
            } else {
                count = 1;
            }
        }

        return 0;
    }
}
