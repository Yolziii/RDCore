import {ACellProbability} from "./ACellProbability";
import {Dice} from "../coreGameplay/dice/Dice";

export class ChanceCellProbability extends ACellProbability {
    public recommendedCombinations():Dice[] {
        return [this.dice];
    }
}