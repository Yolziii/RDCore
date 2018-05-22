import {ICardCellsFactory} from "../cardCellFactories/ICardCellsFactory";
import {ICard} from "../../Card";

/** Фабрика, которая умеет делать только один продукт, но делает єто хорошо */
export interface ICardFactory {
    createCard(cellsFactory:ICardCellsFactory):ICard;
}
