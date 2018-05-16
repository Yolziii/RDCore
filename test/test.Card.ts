import * as assert from "assert";
import "mocha";
import {CellType, IPlayableCell} from "../src/model/Cells";
import {ICard, Card} from "../src/model/Cards";
import {Dice, IDie, DieType} from "../src/model/Dices";
import {CardCellsFactory} from "../src/model/round/CardCellFactories";

describe("Card", () => {
    let card: ICard;

    let cellOnes: IPlayableCell;
    let cellTwos: IPlayableCell;

    beforeEach(() => {
        card = new Card(new CardCellsFactory(), CellType.Ones, CellType.Twos, CellType.ServiceFinalScore);
        cellOnes = card.getCellPlayable(CellType.Ones);
        cellTwos = card.getCellPlayable(CellType.Twos);
    });

    it("Not finished", () => {
        assert.equal(card.finished, false);
    });

    it("Finished", () => {
        function die1(): IDie {
            return {type: DieType.Value, value: 1};
        }

        function die2(): IDie {
            return {type: DieType.Value, value: 2};
        }

        (card.getCell(CellType.Ones) as IPlayableCell).fill(new Dice(die1(), die2(), die1(), die2(), die1()));
        (card.getCell(CellType.Twos) as IPlayableCell).fill(new Dice(die1(), die2(), die1(), die2(), die1()));

        assert.equal(card.finished, true);
    });

    it("hasField()", () => {
        assert.equal(card.hasCell(CellType.Ones), true);
    });

    it("getField()", () => {
        assert.equal(card.getCell(CellType.Ones), cellOnes);
    });

    // TODO: Тесты на ошибки
});
