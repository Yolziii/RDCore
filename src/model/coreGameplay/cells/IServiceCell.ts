import {ICell} from "./ICell";
import {ICard} from "../Card";

/** Сервисная ячейка, результат которой зависит от других ячеек */
export interface IServiceCell extends ICell {
    linkCard(card: ICard): void;
}
