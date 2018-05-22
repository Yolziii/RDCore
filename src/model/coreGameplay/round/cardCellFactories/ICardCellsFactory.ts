import {IServiceCell} from "../../cells/IServiceCell";
import {IPlayableCell} from "../../cells/IPlayableCell";

/** Фабрика для ячеек карточки игрока */
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
