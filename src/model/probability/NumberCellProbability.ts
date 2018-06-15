import {ACellProbability} from "./ACellProbability";
import {Dice} from "../coreGameplay/dice/Dice";
import {PDie} from "./PDie";
import {Config} from "../Config";
import {IDie} from "../coreGameplay/dice/IDie";
import {DieType} from "../coreGameplay/dice/DieType";

export class NumberCellProbability extends ACellProbability {
    private num:number;
    private pdice:PDie;
    private free:number;

    public constructor(num:number, faces = Config.DefaultDiceFaces) {
        super();
        this.num = num;
        this.pdice = new PDie(faces);
    }

    public calculate(dice:Dice, throwsLeft:number):void {
        super.calculate(dice, throwsLeft);

        this.free = dice.length;
        for (let i = 0; i < dice.length; i++) {
            if (dice.hasAt(i)) {
                const die:IDie = dice.getFrom(i);
                if (die.value === this.num || die.type === DieType.Joker) {
                    this.free--;
                }
            }
        }
    }

    public probability():number {
        if (this.free === 0) {
            return 1;
        }

        return this.pdice.bernulliMethod(1/6, this.free, this.free < 3 ? this.free : 3) * this.throwsLeft;
    }

    public recommendedCombinations():Dice[] {
        const toHold:Dice = new Dice();
        for (let i = 0; i < this.dice.length; i++) {
            if (this.dice.hasAt(i)) {
                const die:IDie = this.dice.getFrom(i);
                if (die.value === this.num || die.type === DieType.Joker) {
                    toHold.put(die);
                }
            }
        }

        return [toHold];
    }
}
