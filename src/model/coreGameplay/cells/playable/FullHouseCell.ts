import {CellType} from "../CellType";
import {Config} from "../../../Config";
import {IPlayableCell} from "../IPlayableCell";
import {APlayableCell} from "../APlayableCell";
import {compareBiggerFirst} from "../../../../util/compareBiggerFirst";
import {IDice} from "../../dice/IDice";
import {IDie} from "../../dice/IDie";
import {DieType} from "../../dice/DieType";

export class FullHouseCell extends APlayableCell implements IPlayableCell {
    constructor() {
        super();
        this.type = CellType.FullHouse;
    }

    public get value(): number {
        return this.valueFor(this.cellDice);
    }

    public valueFor(dice: IDice):number {
        const totals: number[] = [];
        let jokers:number = 0;
        for (let i = 0; i < dice.total; i++) {
            const die: IDie = dice.getFrom(i);
            if (die.type !== DieType.Value) {
                if (die.type === DieType.Joker) {
                    jokers++;
                }
                continue;
            }

            const index: number = die.value - 1;
            if (totals[index] !== undefined) {
                totals[index]++;
            } else {
                totals[index] = 1;
            }
        }

        totals.sort(compareBiggerFirst);
        while (totals.length < 2) {
            totals.push(0);
        }

        let was2 = false;
        let was3 = false;
        for (const total of totals) {
            if (total + jokers >= 3) {
                jokers = this.spendJokers(total, 3, jokers);
                was3 = true;
            } else if (total + jokers >= 2) {
                jokers = this.spendJokers(total, 2, jokers);
                was2 = true;
            }
        }

        return was2 && was3 ? Config.CostFullHouse : 0;
    }

    private spendJokers(total:number, need:number, jokers:number):number {
        if (need <= total) {
            return jokers;
        }
        return jokers -= need - total;
    }
}
