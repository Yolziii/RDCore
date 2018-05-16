import {
    Bonus63Cell, BonusRoyalCell, BottomPointsCell, CellType, ChanceCell, FinalScoreCell, FullHouseCell, IPlayableCell,
    IServiceCell,
    KindCell, MultiplierCellDecorator,
    NumberCell, RoyalDiceCell,
    StraightCell,
    TopPointsCell, TotalBonusesCell,
    TotalNumbersCell, TotalNumbersWithBonusCell
} from "../Cells";
import {Config} from "../../Config";

/** Определяет какие ячейки карточки долждна создавать фабрика */
export interface ICardCellsFactory {
    createOnes():IPlayableCell;
    createTwos():IPlayableCell;
    createThrees():IPlayableCell;
    createFours():IPlayableCell;
    createFives():IPlayableCell;
    createSixes():IPlayableCell;

    createServiceTotalNumbers():IServiceCell;
    createServiceBonus63():IServiceCell;
    createServiceTopPoints():IServiceCell;
    createServiceTotalNumbersWithBonus():IServiceCell;

    createKind3():IPlayableCell;
    createKind4():IPlayableCell;
    createFullHouse():IPlayableCell;
    createSmallStraight():IPlayableCell;
    createLargeStraight():IPlayableCell;
    createRoyalDice():IPlayableCell;
    createChance():IPlayableCell;

    createServiceBottomPoints():IServiceCell;
    createServiceBonusRoyal():IServiceCell;
    createServiceTotalBonuses():IServiceCell;
    createServiceFinalScore():IServiceCell;
}

/** Фабрика обычных ячеек */
export class CardCellsFactory implements ICardCellsFactory {
    public createOnes():IPlayableCell {
        return new NumberCell(CellType.Ones, 1);
    }

    public createTwos():IPlayableCell {
        return new NumberCell(CellType.Twos, 2);
    }

    public createThrees():IPlayableCell {
        return new NumberCell(CellType.Threes, 3);
    }

    public createFours():IPlayableCell {
        return new NumberCell(CellType.Fours, 4);
    }

    public createFives():IPlayableCell {
        return new NumberCell(CellType.Fives, 5);
    }

    public createSixes():IPlayableCell {
        return new NumberCell(CellType.Sixes, 6);
    }

    public createServiceTotalNumbers():IServiceCell {
        return new TotalNumbersCell();
    }

    public createServiceBonus63():IServiceCell {
        return new Bonus63Cell();
    }

    public createServiceTopPoints():IServiceCell {
        return new TopPointsCell();
    }

    public createServiceTotalNumbersWithBonus():IServiceCell {
        return new TotalNumbersWithBonusCell();
    }

    public createKind3():IPlayableCell {
        return new KindCell(CellType.Kind3, 3);
    }

    public createKind4():IPlayableCell {
        return new KindCell(CellType.Kind4, 4);
    }

    public createFullHouse():IPlayableCell {
        return new FullHouseCell();
    }

    public createSmallStraight():IPlayableCell {
        return new StraightCell(CellType.SmallStraight, Config.CostSmallStraight, 4);
    }

    public createLargeStraight():IPlayableCell {
        return new StraightCell(CellType.LargeStraight, Config.CostLargeStraight, 5);
    }

    public createRoyalDice():IPlayableCell {
        return new RoyalDiceCell();
    }

    public createChance():IPlayableCell {
        return new ChanceCell();
    }

    public createServiceBottomPoints():IServiceCell {
        return new BottomPointsCell();
    }

    public createServiceBonusRoyal():IServiceCell {
        return new BonusRoyalCell();
    }

    public createServiceTotalBonuses():IServiceCell {
        return new TotalBonusesCell();
    }

    public createServiceFinalScore():IServiceCell {
        return new FinalScoreCell();
    }
}

/** Фабрика ячеек с увеличенными на указанное число значениями */
export class MultiplierCardCellsFactory extends CardCellsFactory {
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
