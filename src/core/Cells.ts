import {Config, DieType, CellType, IDice, IDie, IPlayableCardCell, IServiceCardCell, IPlayerCard} from "../gameplay";
import {Dice} from "./Dices";

let emptyDice = new Dice();

export abstract class PlayableCardCell implements IPlayableCardCell {
    type:CellType;

    protected _dice:IDice = emptyDice;

    isFull() {
        return this._dice != emptyDice;
    }

    value():number {
        return 0;
    }

    dice():IDice {
        return this._dice;
    }

    setDice(dice:IDice):void {
        this._dice = dice;
    }
}

export class NumberCell extends PlayableCardCell {
    private _value:number;

    constructor(type:CellType, value:number) {
        super();
        this.type = type;
        this._value = value;
    }

    value():number {
        let res = 0;
        for (let i=0; i<this._dice.total(); i++) {
            let die:IDie = this._dice.get(i);
            if (die.type == DieType.Value && die.value == this._value) {
                res += die.value;
            }
        }
        return res;
    }
}

export class RoyalDiceCell extends PlayableCardCell implements  IPlayableCardCell {
    constructor() {
        super();
        this.type = CellType.RoyalDice;
    }

    value():number {
        return pointsAsRoyalDice(this._dice);
    }
}

export class ChanceCell extends PlayableCardCell implements IPlayableCardCell {
    constructor() {
        super();
        this.type = CellType.Chance;
    }

    value():number {
        let res = 0;
        for (let i=0; i<this._dice.total(); i++) {
            let die:IDie = this._dice.get(i);
            res += die.value;
        }
        return res;
    }
}

export class KindCell extends PlayableCardCell implements IPlayableCardCell {
    private total:number;

    constructor(type:CellType, total:number) {
        super();
        this.type = type;
        this.total = total;
    }

    value():number {
        let totals:number[] = [];
        let sum:number = 0;
        for (let i = 0; i<this._dice.total(); i++) {
            let die:IDie = this._dice.get(i);
            if (die.type != DieType.Value) continue;

            sum += die.value;
            let index:number = die.value - 1;
            if (totals[index] != undefined) {
                totals[index]++;
            } else {
                totals[index] = 1;
            }
        }

        for (let i=0; i<totals.length; i++) {
            if (totals[i] >= this.total) return sum;
        }
        return 0;
    }
}

export class FullHouseCell extends PlayableCardCell implements IPlayableCardCell {
    constructor() {
        super();
        this.type = CellType.FullHouse;
    }

    value():number {
        let totals:number[] = [];
        for (let i = 0; i < this._dice.total(); i++) {
            let die:IDie = this._dice.get(i);
            if (die.type != DieType.Value) continue;

            let index:number = die.value - 1;
            if (totals[index] != undefined) {
                totals[index]++;
            } else {
                totals[index] = 1;
            }
        }

        let was2 = false;
        let was3 = false;
        for (let i=0; i<totals.length; i++) {
            if (totals[i] == 2) was2 = true;
            if (totals[i] == 3) was3 = true;
        }

        return was2 && was3 ? Config.CostFullHouse : 0;
    }
}

export class StraightCell extends PlayableCardCell implements IPlayableCardCell {
    total:number;
    cost:number;

    constructor(type:CellType, cost:number, total:number) {
        super();
        this.type = type;
        this.cost = cost;
        this.total = total;
    }

    value():number {
        let values:number[] = [];
        for (let i = 0; i < this._dice.total(); i++) {
            let die:IDie = this._dice.get(i);
            if (die.type == DieType.Value) {
                values[i] = die.value;
            } else {
                values[i] = 0;
            }
        }

        values.sort(StraightCell.compare);
        let count = 1;
        for (let i=1; i<values.length; i++) {
            if (values[i] == values[i-1] + 1) {
                count++;
                if (count == this.total) return this.cost;
            }  else {
                count = 1;
            }
        }

        return 0;
    }

    private static compare(a:number, b:number):number {
        if (a == b) return 0;
        return a > b ? 1 : -1;
    }
}

export class TotalNumbersCell implements IServiceCardCell {
    type:CellType;
    private card:IPlayerCard;

    constructor() {
        this.type = CellType.ServiceTotalNumbers;
    }

    linkCard(card:IPlayerCard):void {
        this.card = card;
    }

    value():number {
        return sumPoints(this.card, [CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes]);
    }
}

export class Bonus63Cell implements IServiceCardCell {
    type:CellType;
    private card:IPlayerCard;

    constructor() {
        this.type = CellType.ServiceBonus63;
    }

    linkCard(card:IPlayerCard):void {
        this.card = card;
    }

    value():number {
        let sum = sumPoints(this.card, [CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes]);
        return (sum >= 63) ? Config.CostBonus63 : 0;
    }
}

export class TotalNumbersWithBonusCell implements  IServiceCardCell {
    type:CellType;
    private card:IPlayerCard;

    constructor() {
        this.type = CellType.ServiceTotalNumbersWithBonus;
    }

    linkCard(card:IPlayerCard):void {
        this.card = card;
    }

    value():number {
        let numbers:IServiceCardCell = this.card.getCellService(CellType.ServiceTotalNumbers);
        let bonus:IServiceCardCell = this.card.getCellService(CellType.ServiceBonus63);
        return numbers.value() + bonus.value();
    }
}

export class TopPointsCell implements IServiceCardCell {
    type:CellType;
    private card:IPlayerCard;

    constructor() {
        this.type = CellType.ServiceTopPoints;
    }

    linkCard(card:IPlayerCard):void {
        this.card = card;
    }

    value():number {
        let sum = sumPoints(this.card, [CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes]);
        if (this.card.hasCell(CellType.ServiceBonus63)) {
            sum += this.card.getCellService(CellType.ServiceBonus63).value();
        }
        return sum;
    }
}

export class BottomPointsCell implements IServiceCardCell {
    type:CellType;
    private card:IPlayerCard;

    constructor() {
        this.type = CellType.ServiceBottomPoints;
    }

    linkCard(card:IPlayerCard):void {
        this.card = card;
    }

    value():number {
        return sumPoints(this.card, [CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight, CellType.RoyalDice, CellType.Chance]);
    }
}

export class BonusRoyalCell implements IServiceCardCell {
    type:CellType;
    private card:IPlayerCard;

    constructor() {
        this.type = CellType.ServiceBonusRoyal;
    }

    linkCard(card:IPlayerCard):void {
        this.card = card;
    }

    value():number {
        let valuableTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes,
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight, CellType.RoyalDice, CellType.Chance
        ];

        let totalRoyalDices = 0;
        for (let i = 0; i < valuableTypes.length; i++) {
            let type:CellType = valuableTypes[i];
            if (!this.card.hasCell(type)) continue;

            let dice = this.card.getCellPlayable(type).dice();
            if (pointsAsRoyalDice(dice) != 0) totalRoyalDices++;
        }

        return totalRoyalDices > 1 ? (totalRoyalDices-1) * Config.CostRoyalBonusPerItem: 0;
    }
}

export class TotalBonusesCell implements IServiceCardCell {
    type:CellType;
    private card:IPlayerCard;

    constructor() {
        this.type = CellType.ServiceTotalBonuses;
    }

    linkCard(card:IPlayerCard):void {
        this.card = card;
    }

    value():number {
       return sumPoints(this.card, [CellType.ServiceBonus63, CellType.ServiceBonusRoyal]);
    }
}

export class FinalScoreCell implements IServiceCardCell {
    type:CellType;
    private card:IPlayerCard;

    constructor() {
        this.type = CellType.ServiceFinalScore;
    }

    linkCard(card:IPlayerCard):void {
        this.card = card;
    }

    value():number {
        return sumPoints(this.card, [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes,
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight, CellType.RoyalDice, CellType.Chance,
            CellType.ServiceBonus63, CellType.ServiceBonusRoyal]);
    }
}

function pointsAsRoyalDice(dice:IDice) {
    if (dice.total() == 0) return 0;

    let first:IDie = dice.get(0);
    for (let i=1; i<dice.total(); i++) {
        let die:IDie = dice.get(i);
        if (die.type != DieType.Value || die.value != first.value) {
            return 0;
        }
    }
    return Config.CostRoyalDice;
}

function sumPoints(card:IPlayerCard, types:CellType[]):number {
    let sum = 0;
    for (let i = 0; i < types.length; i++) {
        let type:CellType = types[i];
        if (!card.hasCell(type)) continue;

        sum += card.getCell(type).value();
    }
    return sum;
}