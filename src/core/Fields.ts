import {Config, DieType, FieldType, IDice, IDie, IPlayableCardField} from "../gameplay";

export abstract class PlayableCardField implements IPlayableCardField {
    type:FieldType;

    protected _dice:IDice = null;

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

export class NumberField extends PlayableCardField {
    private _value:number;

    constructor(type:FieldType, value:number) {
        super();
        this.type = type;
        this._value = value;
    }

    value():number {
        if (this._dice == null) return 0;

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

export class RoyalDiceField extends PlayableCardField implements  IPlayableCardField {
    constructor() {
        super();
        this.type = FieldType.RoyalDice;
    }

    value():number {
        if (this._dice == null) return 0;

        let first:IDie = this._dice.get(0);
        for (let i=1; i<this._dice.total(); i++) {
            let die:IDie = this._dice.get(i);
            if (die.type != DieType.Value || die.value != first.value) {
                return 0;
            }
        }
        return Config.CostRoyalDice;
    }
}

export class ChanceField extends PlayableCardField implements IPlayableCardField {
    constructor() {
        super();
        this.type = FieldType.Chance;
    }

    value():number {
        if (this._dice == null) return 0;

        let res = 0;
        for (let i=0; i<this._dice.total(); i++) {
            let die:IDie = this._dice.get(i);
            res += die.value;
        }
        return res;
    }
}

export class KindField extends PlayableCardField implements IPlayableCardField {
    private total:number;

    constructor(type:FieldType, total:number) {
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

export class FullHouse extends PlayableCardField implements IPlayableCardField {
    constructor() {
        super();
        this.type = FieldType.FullHouse;
    }

    value():number {
        let totals:number[] = [];
        for (let i = 0; i<this._dice.total(); i++) {
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

export class StraightField extends PlayableCardField implements IPlayableCardField {
    total:number;
    cost:number;

    constructor(type:FieldType, cost:number, total:number) {
        super();
        this.type = type;
        this.cost = cost;
        this.total = total;
    }

    value():number {
        let values:number[] = [];
        for (let i = 0; i<this._dice.total(); i++) {
            let die:IDie = this._dice.get(i);
            if (die.type == DieType.Value) {
                values[i] = die.value;
            } else {
                values[i] = 0;
            }
        }

        values.sort(this.compare);
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

    private compare(a:number, b:number) {
        if (a == b) return 0;
        return a > b ? 1 : -1;
    }
}