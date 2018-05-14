import {Dice, DieType, IDice, IDie, JokerDie} from "../Dices";
import {IRoundPlayer} from "./Rounds";

/**
 *
 */
export class Thrower {
    private player: IRoundPlayer;

    public linkRoundPlayer(player: IRoundPlayer) {
        this.player = player;
    }

    /** Шаблонный метод, реализует алгоритм бросания костей */
    public throwTemplate() {
        const dice: IDice = this.diceFactory();
        for (let i = 0; i < dice.max; i++) {
            this.fillDie(dice, i);

            if (this.player.throwed.hasAt(i)) {
                this.player.throwed.popFrom(i);
            }

            if (!this.player.holded.hasAt(i)) {
                this.player.throwed.put(dice.getFrom(i));
            }
        }
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
