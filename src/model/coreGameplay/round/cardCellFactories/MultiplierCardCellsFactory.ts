import {IServiceCell} from "../../cells/IServiceCell";
import {IPlayableCell} from "../../cells/IPlayableCell";
import {MultiplierCellDecorator} from "../../cells/decorators/MultiplierCellDecorator";
import {Bonus63Cell} from "../../cells/service/Bonus63Cell";
import {Config} from "../../../Config";
import {DefaultCardCellsFactory} from "./DefaultCardCellsFactory";

/** Фабрика ячеек с увеличенными на указанное число значениями */
export class MultiplierCardCellsFactory extends DefaultCardCellsFactory {
    private multiple:number;

    constructor(multiple:number) {
        super();
        this.multiple = multiple;
    }

    public createOnes():IPlayableCell {
        return new MultiplierCellDecorator(super.createOnes(), this.multiple);
    }

    public createTwos():IPlayableCell {
        return new MultiplierCellDecorator(super.createTwos(), this.multiple);
    }

    public createThrees():IPlayableCell {
        return new MultiplierCellDecorator(super.createThrees(), this.multiple);
    }

    public createFours():IPlayableCell {
        return new MultiplierCellDecorator(super.createFours(), this.multiple);
    }

    public createFives():IPlayableCell {
        return new MultiplierCellDecorator(super.createFives(), this.multiple);
    }

    public createSixes():IPlayableCell {
        return new MultiplierCellDecorator(super.createSixes(), this.multiple);
    }

    public createKind3():IPlayableCell {
        return new MultiplierCellDecorator(super.createKind3(), this.multiple);
    }

    public createKind4():IPlayableCell {
        return new MultiplierCellDecorator(super.createKind4(), this.multiple);
    }

    public createFullHouse():IPlayableCell {
        return new MultiplierCellDecorator(super.createFullHouse(), this.multiple);
    }

    public createSmallStraight():IPlayableCell {
        return new MultiplierCellDecorator(super.createSmallStraight(), this.multiple);
    }

    public createLargeStraight():IPlayableCell {
        return new MultiplierCellDecorator(super.createLargeStraight(), this.multiple);
    }

    public createRoyalDice():IPlayableCell {
        return new MultiplierCellDecorator(super.createRoyalDice(), this.multiple);
    }

    public createChance():IPlayableCell {
        return new MultiplierCellDecorator(super.createChance(), this.multiple);
    }

    public createServiceBonus63():IServiceCell {
        return new Bonus63Cell(Config.ThresholdBonus63 * this.multiple);
    }
}
