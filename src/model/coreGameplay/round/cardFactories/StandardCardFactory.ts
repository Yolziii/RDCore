import {CellType} from "../../cells/CellType";
import {ICardFactory} from "./ICardFactory";
import {DefaultCardCellsFactory} from "../cardCellFactories/DefaultCardCellsFactory";
import {Card, ICard} from "../../Card";

/** Создает обычную ячейку */
export class StandardCardFactory implements ICardFactory {
    public createCard(cellsFactory:DefaultCardCellsFactory):ICard {
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
