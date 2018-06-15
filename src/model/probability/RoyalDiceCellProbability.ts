import {Dice} from "../coreGameplay/dice/Dice";
import {Config} from "../Config";
import {PDie} from "./PDie";
import {ACellProbability} from "./ACellProbability";
import {IDie} from "../coreGameplay/dice/IDie";
import {DieType} from "../coreGameplay/dice/DieType";

export class RoyalDiceCellProbability extends ACellProbability {
    private pdice:PDie;

    private totals = [];
    private jokers = 0;
    private max = 0;

    public constructor(faces = Config.DefaultDiceFaces) {
        super();
        this.pdice = new PDie(faces);
    }

    public probability():number {
        if (this.max === this.dice.length) {
            return 1;
        }
        return this.pdice.bernulliMethod(1/6, this.dice.length-this.max, this.dice.length-this.max) * this.throwsLeft;
    }

    public recommendedCombinations():Dice[] {
        const dices:Dice[] = [];

        for (const value of this.totals) {
            if (value == null) {
                continue;
            }

            const toHold:Dice = new Dice();
            if (value > 0 && value === this.max - this.jokers) {
                for (let j = 0; j<this.dice.length; j++) {
                    if (this.dice.hasAt(j)) {
                        const die:IDie = this.dice.getFrom(j);
                        if (die.value === value) {
                            toHold.put(die);
                        }
                    }
                }
            }

            dices.push(toHold);
        }

        // Джокера лепим по все комбинации
        for (let i = 0; i<this.dice.length; i++) {
            if (this.dice.hasAt(i)) {
                const die = this.dice.getFrom(i);
                if (die.type === DieType.Joker) {
                    for (this.dice of dices) {
                        this.dice.put(die);
                    }
                }
            }
        }

        return dices;
    }

    public calculate(dice:Dice, throwsLeft:number) {
        super.calculate(dice, throwsLeft);

        this.totals = [];
        this.jokers = 0;
        this.max = 0;

        for (let i = 0; i < dice.length; i++) {
            if (dice.hasAt(i)) {
                const die:IDie = dice.getFrom(i);
                if (die.type === DieType.Value) {
                    if (this.totals[die.value] == null) {
                        this.totals[die.value] = 0;
                    }
                    this.totals[die.value]++;
                } else if (die.type === DieType.Joker) {
                    this.jokers++;
                }
            }
        }

        for (let i = 0; i < dice.length; i++) {
            const total = this.totals[i];
            if (total != null && total > this.max) {
                this.max = total + this.jokers;
            }
        }
    }
}
