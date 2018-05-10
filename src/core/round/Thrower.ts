import {Dice, DieType, IDice, IDie} from "../Dices";
import {IRoundPlayer} from "../Rounds";

export class Thrower {
    private player: IRoundPlayer;

    public linkRoundPlayer(player: IRoundPlayer) {
        this.player = player;
    }

    public throwTemplate() {
        let dice: IDice = this.diceFactory();
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
        let die = {type: DieType.Value, value: random};
        return die;
    }
}
