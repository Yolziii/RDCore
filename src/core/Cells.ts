import {Config} from "./Config";
import {Dice} from "./Dices";
import {CellType, DieType, IDice, IDie, IPlayableCardCell, IPlayerCard, IServiceCardCell} from "./gameplay";
const emptyDice = new Dice();

export abstract class APlayableCardCell implements IPlayableCardCell {
    public type: CellType;

    protected cellDice: IDice = emptyDice;

    public isFull() {
        return this.cellDice !== emptyDice;
    }

    public value(): number {
        return 0;
    }

    public dice(): IDice {
        return this.cellDice;
    }

    public setDice(dice: IDice): void {
        this.cellDice = dice;
    }
}

export class NumberCell extends APlayableCardCell {
    private cellValue: number;

    constructor(type: CellType, value: number) {
        super();
        this.type = type;
        this.cellValue = value;
    }

    public value(): number {
        let res = 0;
        for (let i = 0; i < this.cellDice.total(); i++) {
            const die: IDie = this.cellDice.get(i);
            if (die.type === DieType.Value && die.value === this.cellValue) {
                res += die.value;
            }
        }
        return res;
    }
}

export class RoyalDiceCell extends APlayableCardCell implements IPlayableCardCell {
    constructor() {
        super();
        this.type = CellType.RoyalDice;
    }

    public value(): number {
        return pointsAsRoyalDice(this.cellDice);
    }
}

export class ChanceCell extends APlayableCardCell implements IPlayableCardCell {
    constructor() {
        super();
        this.type = CellType.Chance;
    }

    public value(): number {
        let res = 0;
        for (let i = 0; i < this.cellDice.total(); i++) {
            const die: IDie = this.cellDice.get(i);
            res += die.value;
        }
        return res;
    }
}

export class KindCell extends APlayableCardCell implements IPlayableCardCell {
    private total: number;

    constructor(type: CellType, total: number) {
        super();
        this.type = type;
        this.total = total;
    }

    public value(): number {
        const totals: number[] = [];
        let sum: number = 0;
        for (let i = 0; i < this.cellDice.total(); i++) {
            const die: IDie = this.cellDice.get(i);
            if (die.type !== DieType.Value) {
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

        for (const total of totals) {
            if (total >= this.total) {
                return sum;
            }
        }
        return 0;
    }
}

export class FullHouseCell extends APlayableCardCell implements IPlayableCardCell {
    constructor() {
        super();
        this.type = CellType.FullHouse;
    }

    public value(): number {
        const totals: number[] = [];
        for (let i = 0; i < this.cellDice.total(); i++) {
            const die: IDie = this.cellDice.get(i);
            if (die.type !== DieType.Value) {
                continue;
            }

            const index: number = die.value - 1;
            if (totals[index] !== undefined) {
                totals[index]++;
            } else {
                totals[index] = 1;
            }
        }

        let was2 = false;
        let was3 = false;
        for (const total of totals) {
            if (total === 2) {
                was2 = true;
            }
            if (total === 3) {
                was3 = true;
            }
        }

        return was2 && was3 ? Config.CostFullHouse : 0;
    }
}

export class StraightCell extends APlayableCardCell implements IPlayableCardCell {
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

    public value(): number {
        const values: number[] = [];
        for (let i = 0; i < this.cellDice.total(); i++) {
            const die: IDie = this.cellDice.get(i);
            if (die.type === DieType.Value) {
                values[i] = die.value;
            } else {
                values[i] = 0;
            }
        }

        values.sort(StraightCell.compare);
        let count = 1;
        for (let i = 1; i < values.length; i++) {
            if (values[i] === values[i - 1] + 1) {
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

export class TotalNumbersCell implements IServiceCardCell {
    public type: CellType;
    private card: IPlayerCard;

    constructor() {
        this.type = CellType.ServiceTotalNumbers;
    }

    public linkCard(card: IPlayerCard): void {
        this.card = card;
    }

    public value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        return sumPoints(this.card, numberTypes);
    }
}

export class Bonus63Cell implements IServiceCardCell {
    public type: CellType;
    private card: IPlayerCard;

    constructor() {
        this.type = CellType.ServiceBonus63;
    }

    public linkCard(card: IPlayerCard): void {
        this.card = card;
    }

    public value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        const sum = sumPoints(this.card, numberTypes);
        return (sum >= 63) ? Config.CostBonus63 : 0;
    }
}

export class TotalNumbersWithBonusCell implements IServiceCardCell {
    public type: CellType;
    private card: IPlayerCard;

    constructor() {
        this.type = CellType.ServiceTotalNumbersWithBonus;
    }

    public linkCard(card: IPlayerCard): void {
        this.card = card;
    }

    public value(): number {
        const numbers: IServiceCardCell = this.card.getCellService(CellType.ServiceTotalNumbers);
        const bonus: IServiceCardCell = this.card.getCellService(CellType.ServiceBonus63);
        return numbers.value() + bonus.value();
    }
}

export class TopPointsCell implements IServiceCardCell {
    public type: CellType;
    private card: IPlayerCard;

    constructor() {
        this.type = CellType.ServiceTopPoints;
    }

    public linkCard(card: IPlayerCard): void {
        this.card = card;
    }

    public value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        let sum = sumPoints(this.card, numberTypes);
        if (this.card.hasCell(CellType.ServiceBonus63)) {
            sum += this.card.getCellService(CellType.ServiceBonus63).value();
        }
        return sum;
    }
}

export class BottomPointsCell implements IServiceCardCell {
    public type: CellType;
    private card: IPlayerCard;

    constructor() {
        this.type = CellType.ServiceBottomPoints;
    }

    public linkCard(card: IPlayerCard): void {
        this.card = card;
    }

    public value(): number {
        const types = [
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance];
        return sumPoints(this.card, types);
    }
}

export class BonusRoyalCell implements IServiceCardCell {
    public type: CellType;
    private card: IPlayerCard;

    constructor() {
        this.type = CellType.ServiceBonusRoyal;
    }

    public linkCard(card: IPlayerCard): void {
        this.card = card;
    }

    public value(): number {
        const valuableTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes,
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance];

        let totalRoyalDices = 0;
        for (const type of valuableTypes) {
            if (!this.card.hasCell(type)) {
                continue;
            }

            const dice = this.card.getCellPlayable(type).dice();
            if (pointsAsRoyalDice(dice) !== 0) {
                totalRoyalDices++;
            }
        }

        return totalRoyalDices > 1 ? (totalRoyalDices - 1) * Config.CostRoyalBonusPerItem : 0;
    }
}

export class TotalBonusesCell implements IServiceCardCell {
    public type: CellType;
    private card: IPlayerCard;

    constructor() {
        this.type = CellType.ServiceTotalBonuses;
    }

    public linkCard(card: IPlayerCard): void {
        this.card = card;
    }

    public value(): number {
        return sumPoints(this.card, [CellType.ServiceBonus63, CellType.ServiceBonusRoyal]);
    }
}

export class FinalScoreCell implements IServiceCardCell {
    public type: CellType;
    private card: IPlayerCard;

    constructor() {
        this.type = CellType.ServiceFinalScore;
    }

    public linkCard(card: IPlayerCard): void {
        this.card = card;
    }

    public value(): number {
        return sumPoints(this.card, [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes,
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance,
            CellType.ServiceBonus63, CellType.ServiceBonusRoyal]);
    }
}

function pointsAsRoyalDice(dice: IDice) {
    if (dice.total() === 0) {
        return 0;
    }

    const first: IDie = dice.get(0);
    for (let i = 1; i < dice.total(); i++) {
        const die: IDie = dice.get(i);
        if (die.type !== DieType.Value || die.value !== first.value) {
            return 0;
        }
    }
    return Config.CostRoyalDice;
}

function sumPoints(card: IPlayerCard, types: CellType[]): number {
    let sum = 0;
    for (const type of types) {
        if (!card.hasCell(type)) {
            continue;
        }

        sum += card.getCell(type).value();
    }
    return sum;
}
