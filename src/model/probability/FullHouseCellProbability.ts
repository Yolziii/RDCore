import {ACellProbability} from "./ACellProbability";
import {Dice} from "../coreGameplay/dice/Dice";
import {PDie} from "./PDie";
import {Config} from "../Config";

export class FullHouseCellProbability extends ACellProbability {
    private pdice:PDie;

    public constructor(faces = Config.DefaultDiceFaces) {
        super();
        this.pdice = new PDie(faces);
    }

    public calculate(dice:Dice, throwsLeft:number):void {
        super.calculate(dice, throwsLeft);
    }

    public probability():number {
        const cleanFB = this.pdice.bernulliMethod(1/6, 2, 2) + this.pdice.bernulliMethod(1/6, 3, 3);
        const fourPlusOne = this.pdice.bernulliMethod(1/6, 4, 4) + 1/216 + 5/7776;
        const royalDices = this.pdice.bernulliMethod(1/6, 5, 5);
        return (cleanFB + royalDices + fourPlusOne) * this.throwsLeft;
    }

    public recommendedCombinations():Dice[] {
        return [];
    }
}
