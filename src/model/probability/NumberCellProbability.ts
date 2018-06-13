import {ACellProbability} from "./CellProbability";
import {Dice} from "../coreGameplay/dice/Dice";
import {PDie} from "./PDie";
import {Config} from "../Config";

export class NumberCellProbability extends ACellProbability {
    private num:number;
    private pdice:PDie;

    public constructor(num:number, faces = Config.DefaultDiceFaces) {
        super();
        this.num = num;
        this.pdice = new PDie(faces);
    }

    public probability(dice:Dice, throwsLeft:number):number {
        let total = 0;
        let free = dice.length;
        for (let i = 0; i < dice.length; i++) {
            if (dice.hasAt(i)) {
                if (dice.getFrom(i).value === this.num) {
                    total++;
                    free--;
                }
            }
        }

        if (free === 0) {
            return 1;
        }

        return this.pdice.bernulliMethod(1/6, free, free < 3 ? free : 3) * throwsLeft;
    }
}
