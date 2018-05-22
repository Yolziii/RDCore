import {CellType} from "../../cells/CellType";
import {IServiceCell} from "../../cells/IServiceCell";
import {RoyalDiceCell} from "../../cells/playable/RoyalDiceCell";
import {TotalNumbersWithBonusCell} from "../../cells/service/TotalNumbersWithBonusCell";
import {IPlayableCell} from "../../cells/IPlayableCell";
import {TotalNumbersCell} from "../../cells/service/TotalNumbersCell";
import {TopPointsCell} from "../../cells/service/TopPointsCell";
import {BonusRoyalCell} from "../../cells/service/BonusRoyalCell";
import {Bonus63Cell} from "../../cells/service/Bonus63Cell";
import {ChanceCell} from "../../cells/playable/ChanceCell";
import {TotalBonusesCell} from "../../cells/service/TotalBonusesCell";
import {KindCell} from "../../cells/playable/KindCell";
import {BottomPointsCell} from "../../cells/service/BottomPointsCell";
import {StraightCell} from "../../cells/playable/StraightCell";
import {NumberCell} from "../../cells/playable/NumberCell";
import {Config} from "../../../Config";
import {FullHouseCell} from "../../cells/playable/FullHouseCell";
import {FinalScoreCell} from "../../cells/service/FinalScoreCell";
import {ICardCellsFactory} from "./ICardCellsFactory";

/** Фабрика обычных ячеек */
export class DefaultCardCellsFactory implements ICardCellsFactory {
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
