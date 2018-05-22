import {IDice} from "../dice/IDice";
import {Dice} from "../dice/Dice";
import {IDie} from "../dice/IDie";
import {DieType} from "../dice/DieType";
import {JokerDie} from "../dice/JokerDie";
import {IRoundPlayer} from "./IRoundPlayer";

export class Thrower {
    private player: IRoundPlayer;

    public linkRoundPlayer(player: IRoundPlayer) {
        this.player = player;
    }

    /** Шаблонный метод, реализует алгоритм бросания костей */
    public throwTemplate() {
        const dice: IDice = this.diceFactory();
        let j = 0;
        for (let i = 0; i < this.player.holded.length; i++) {
            if (!this.player.holded.hasAt(i)) {
                this.fillDie(dice, j);
                j++;
            }
        }

        this.player.setThrowedDice(dice);
    }

    protected diceFactory():IDice {
        return new Dice();
    }

    protected fillDie(dice:IDice, index:number) {
        dice.putTo(this.dieFactory(), index);
    }

    protected dieFactory(): IDie {
        const random = Math.floor(Math.random() * 6) + 1;
        const die = {type: DieType.Value, value: random};
        return die;
    }
}

export class LazyThrower extends Thrower {
    public throwTemplate() {/**/}
}

export class JokerThrower extends Thrower {
    protected dieFactory(): IDie {
        const random = Math.random();
        if (random < 0.05) {
            return JokerDie;
        } else {
            return super.dieFactory();
        }
    }
}
