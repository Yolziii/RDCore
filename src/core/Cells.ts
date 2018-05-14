import {Config} from "./Config";
import {ICard} from "./Cards";
import {IDice, IDie, DieType, NullDice, Dice} from "./Dices";

export enum CellType {
    Ones = "Ones",
    Twos = "Twos",
    Threes = "Threes",
    Fours = "Fours",
    Fives = "Fives",
    Sixes = "Sixes",

    Kind3 = "Kind3",
    Kind4 = "Kind4",
    FullHouse = "FullHouse",
    SmallStraight = "SmallStraight",
    LargeStraight = "LargeStraight",
    RoyalDice = "RoyalDice",
    Chance = "Chance",

    ServiceTotalNumbers = "ServiceTotalNumbers",
    ServiceBonus63 = "ServiceBonus63",
    ServiceTotalNumbersWithBonus = "ServiceTotalNumbersWithBonus",

    ServiceTopPoints = "ServiceTopPoints",
    ServiceBottomPoints = "ServiceBottomPoints",

    ServiceBonusRoyal = "ServiceBonusRoyal",
    ServiceTotalBonuses = "ServiceTotalBonuses",

    ServiceFinalScore = "ServiceFinalScore",
}

export interface ICell {
    readonly type: CellType;
    readonly value: number;
}

export interface IPlayableCell extends ICell {
    readonly isFull: boolean;
    readonly dice: IDice;

    fill(dice: IDice): void;
    valueFor(dice: IDice):void;
}

export interface IServiceCell extends ICell {
    linkCard(card: ICard): void;
}

export abstract class APlayableCell implements IPlayableCell {
    public type: CellType;

    protected cellDice: IDice = NullDice;

    public get isFull() {
        return this.cellDice !== NullDice;
    }

    public get value(): number {
        return 0;
    }

    public get dice(): IDice {
        return this.cellDice;
    }

    public fill(dice: IDice): void {
        this.cellDice = new Dice();
        for (let i = 0; i<dice.max; i++) {
            this.cellDice.put(dice.getFrom(i));
        }
    }

    public abstract valueFor(dice: IDice):void;
}

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

export class TotalNumbersCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceTotalNumbers;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        return sumPoints(this.card, numberTypes);
    }
}

export class Bonus63Cell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceBonus63;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        const sum = sumPoints(this.card, numberTypes);
        return (sum >= 63) ? Config.CostBonus63 : 0;
    }
}

export class TotalNumbersWithBonusCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceTotalNumbersWithBonus;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const numbers: IServiceCell = this.card.getCellService(CellType.ServiceTotalNumbers);
        const bonus: IServiceCell = this.card.getCellService(CellType.ServiceBonus63);
        return numbers.value + bonus.value;
    }
}

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

export class RoyalDiceCell extends APlayableCell implements IPlayableCell {
    constructor() {
        super();
        this.type = CellType.RoyalDice;
    }

    public get value(): number {
        return pointsAsRoyalDice(this.cellDice);
    }

    public valueFor(dice: IDice):number {
        return pointsAsRoyalDice(dice);
    }
}

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

export class BottomPointsCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceBottomPoints;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const types = [
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance];
        return sumPoints(this.card, types);
    }
}

export class BonusRoyalCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceBonusRoyal;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const valuableTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes,
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance];

        let totalRoyalDices = 0;
        for (const type of valuableTypes) {
            if (!this.card.hasCell(type)) {
                continue;
            }

            const dice = this.card.getCellPlayable(type).dice;
            if (pointsAsRoyalDice(dice) !== 0) {
                totalRoyalDices++;
            }
        }

        return totalRoyalDices > 1 ? (totalRoyalDices - 1) * Config.CostRoyalBonusPerItem : 0;
    }
}

export class TotalBonusesCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceTotalBonuses;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        return sumPoints(this.card, [CellType.ServiceBonus63, CellType.ServiceBonusRoyal]);
    }
}

export class TopPointsCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceTopPoints;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        let sum = sumPoints(this.card, numberTypes);
        if (this.card.hasCell(CellType.ServiceBonus63)) {
            sum += this.card.getCellService(CellType.ServiceBonus63).value;
        }
        return sum;
    }
}

export class FinalScoreCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceFinalScore;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        return sumPoints(this.card, [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes,
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance,
            CellType.ServiceBonus63, CellType.ServiceBonusRoyal]);
    }
}

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

function compareBiggerFirst(a: number, b: number): number {
    if (a === b) {
        return 0;
    }
    return a > b ? -1 : 1;
}
