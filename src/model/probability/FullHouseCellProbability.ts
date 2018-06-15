import {ACellProbability} from "./ACellProbability";
import {Dice} from "../coreGameplay/dice/Dice";

export class FullHouseCellProbability extends ACellProbability {

    public calculate(dice:Dice, throwsLeft:number):void {
        super.calculate(dice, throwsLeft);
    }

    public probability():number {
        return 0;
    }

    public recommendedCombinations():Dice[] {
        return [];
    }
}
