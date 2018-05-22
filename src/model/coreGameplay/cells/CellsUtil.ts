import {Config} from "../../Config";
import {CellType} from "./CellType";
import {IDice} from "../dice/IDice";
import {IDie} from "../dice/IDie";
import {DieType} from "../dice/DieType";
import {ICard} from "../Card";

export function pointsAsRoyalDice(dice: IDice) {
    if (dice.total === 0) {
        return 0;
    }

    const first: IDie = dice.getFrom(0);
    for (let i = 1; i < dice.total; i++) {
        const die: IDie = dice.getFrom(i);
        if (die.type !== DieType.Value) {
            if (die.type !== DieType.Joker) {
                return 0;
            }
        } else if (die.value !== first.value) {
            return 0;
        }
    }
    return Config.CostRoyalDice;
}

export function sumPoints(card: ICard, types: CellType[]): number {
    let sum = 0;
    for (const type of types) {
        if (!card.hasCell(type)) {
            continue;
        }

        sum += card.getCell(type).value;
    }
    return sum;
}
