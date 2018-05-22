import {CellType} from "../CellType";
import {IPlayableCell} from "../IPlayableCell";
import {APlayableCell} from "../APlayableCell";
import {compareBiggerFirst} from "../../../../util/compareBiggerFirst";
import {IDice} from "../../dice/IDice";
import {IDie} from "../../dice/IDie";
import {DieType} from "../../dice/DieType";

export class KindCell extends APlayableCell implements IPlayableCell {
    private total: number;

    constructor(type: CellType, total: number) {
        super();
        this.type = type;
        this.total = total;
    }

    public get value(): number {
        return this.valueFor(this.cellDice);
    }

    public valueFor(dice: IDice):number {
        const totals: number[] = [];
        let sum: number = 0;
        let jokers:number = 0;
        for (let i = 0; i < dice.total; i++) {
            const die: IDie = dice.getFrom(i);
            if (die.type !== DieType.Value) {
                if (die.type === DieType.Joker) {
                    jokers++;
                }
                continue;
            }

            sum += die.value;
            const index: number = die.value - 1;
            if (totals[index] !== undefined) {
                totals[index]++;
            } else {
                totals[index] = 1;
            }
        }

        totals.sort(compareBiggerFirst);
        for (const total of totals) {
            if (total + jokers >= this.total) {
                return sum;
            }
        }
        return 0;
    }
}
