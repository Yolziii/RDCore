import {IDictionary, IDictionaryInt} from "../../util/Dictionaries";
import {RDErrorCode} from "../RDErrorCode";
import RDError from "../RDError";
import {CellType, ICell, IPlayableCell, IServiceCell, NumberCell} from "./Cells";
import {IDice} from "./Dices";
import {ICardCellsFactory} from "./round/CardCellFactories";

export interface ICard {
    readonly finished: boolean;

    hasCell(type: CellType): boolean;
    getCell(type: CellType): IPlayableCell | IServiceCell;

    getCellPlayable(type: CellType): IPlayableCell;
    getCellService(type: CellType): IServiceCell;

    fillCell(cellType: CellType, dice: IDice);
}

export class Card implements ICard {
    private static isPlayableCell(cell: IPlayableCell | IServiceCell): cell is IPlayableCell {
        return (cell as IPlayableCell).dice !== undefined;
    }

    private cells: IDictionary<ICell> = {};

    constructor(factory:ICardCellsFactory, ...types: CellType[]) {
         if (types === undefined  || types.length === 0) {
            throw new RDError(RDErrorCode.NO_ANY_CELL, "Card must contain cells!");
         }

         for (const type of types) {
            if (this.cells[type] != null) {
                // TODO: Выкидывать исключение
            }

            let cell: IPlayableCell | IServiceCell;
            switch (type) {
                case CellType.Ones: cell = factory.createOnes(); break;
                case CellType.Twos: cell = factory.createTwos(); break;
                case CellType.Threes: cell = factory.createThrees(); break;
                case CellType.Fours: cell = factory.createFours(); break;
                case CellType.Fives: cell = factory.createFives(); break;
                case CellType.Sixes: cell = factory.createSixes(); break;

                case CellType.ServiceTotalNumbers: cell = factory.createServiceTotalNumbers(); break;
                case CellType.ServiceBonus63: cell = factory.createServiceBonus63(); break;
                case CellType.ServiceTopPoints: cell = factory.createServiceTopPoints(); break;
                case CellType.ServiceTotalNumbersWithBonus: cell = factory.createServiceTotalNumbersWithBonus(); break;

                case CellType.Kind3: cell = factory.createKind3(); break;
                case CellType.Kind4: cell = factory.createKind4(); break;
                case CellType.FullHouse: cell = factory.createFullHouse(); break;
                case CellType.SmallStraight: cell = factory.createSmallStraight(); break;
                case CellType.LargeStraight: cell = factory.createLargeStraight(); break;
                case CellType.RoyalDice: cell = factory.createRoyalDice(); break;
                case CellType.Chance: cell = factory.createChance(); break;

                case CellType.ServiceBottomPoints: cell = factory.createServiceBottomPoints(); break;
                case CellType.ServiceBonusRoyal: cell = factory.createServiceBonusRoyal(); break;
                case CellType.ServiceTotalBonuses: cell = factory.createServiceTotalBonuses(); break;
                case CellType.ServiceFinalScore: cell = factory.createServiceFinalScore(); break;
            }

            if (!Card.isPlayableCell(cell)) {
                cell.linkCard(this);
            }

            this.cells[type] = cell;
         }

         if (this.cells[CellType.ServiceFinalScore] === undefined) {
            throw new RDError(RDErrorCode.NO_FINAL_SCORE_CELL, "Card must contain at least CellType.ServiceFinalScore cell!");
         }
    }

    public get finished() {
        for (const type in this.cells) {
            if (!this.cells.hasOwnProperty(type)) {
                continue;
            }
            const cell: IPlayableCell | IServiceCell = this.getCell(type as CellType);
            if (Card.isPlayableCell(cell)) {
                if (!cell.isFull) {
                    return false;
                }
            }
        }
        return true;
    }

    public hasCell(type: CellType): boolean {
        return this.cells[type] !== undefined;
    }

    public getCell(type: CellType): IPlayableCell | IServiceCell {
        const cell: ICell = this.cells[type];
        if (cell === undefined) {
            // TODO: Выкидывать исключение
        }
        return cell as IPlayableCell | IServiceCell;
    }

    public fillCell(type: CellType, dice: IDice) {
        const cell = this.getCell(type);
        if (Card.isPlayableCell(cell)) {
            cell.fill(dice);
        } else {
            // TODO: Выкидывать исключение
            throw new RDError(RDErrorCode.UNDEFINED);
        }
    }

    public getCellPlayable(type: CellType): IPlayableCell {
        const cell = this.getCell(type);
        if (Card.isPlayableCell(cell)) {
            return cell;
        } else {
            // TODO: Выкидывать исключение
            throw new RDError(RDErrorCode.UNDEFINED);
        }
    }

    public getCellService(type: CellType): IServiceCell {
        const cell = this.getCell(type);
        if (!Card.isPlayableCell(cell)) {
            return cell;
        } else {
            // TODO: Выкидывать исключение
            throw new RDError(RDErrorCode.UNDEFINED);
        }
    }
}
