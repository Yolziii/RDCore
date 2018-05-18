import {CardCellsFactory, ICardCellsFactory} from "./CardCellFactories";
import {Card, ICard} from "../Cards";
import {CellType} from "../Cells";

export interface ICardFactory {
    createCard(cellsFactory:ICardCellsFactory):ICard;
}

export class StandardCardFactory implements ICardFactory {
    public createCard(cellsFactory:CardCellsFactory) {
        return new Card(
            cellsFactory,

            CellType.Ones,
            CellType.Twos,
            CellType.Threes,
            CellType.Fours,
            CellType.Fives,
            CellType.Sixes,
            CellType.ServiceBonus63,
            CellType.ServiceTopPoints,
            CellType.Kind3,
            CellType.Kind4,
            CellType.FullHouse,
            CellType.SmallStraight,
            CellType.LargeStraight,
            CellType.RoyalDice,
            CellType.Chance,
            CellType.ServiceBottomPoints,
            CellType.ServiceFinalScore
        );
    }
}
