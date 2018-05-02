import {CellType, IDice, IRound} from "../gameplay";
import {PlayerCard} from "../core/PlayerCard";

export class SingleRound implements IRound {
    private _holder:IDice;

    holder():IDice {

    }

    current():IDice {

    }

    throw():IDice {

    }

    hold(fromDice:IDice, index:number) {

    }

    unhold(toDice:IDice, index:number) {

    }

    fillCell(card:PlayerCard, type:CellType, dice:IDice) {

    }

    exit() {

    }

    finished() {
        return false;
    }
}