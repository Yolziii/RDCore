import {Dice} from "../coreGameplay/dice/Dice";

export abstract class ACellProbability {
    public probability(dice:Dice, throwsLeft:number):number {
        return 0;
    }
}
