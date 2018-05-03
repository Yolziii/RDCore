import * as assert from "assert";
import "mocha";
import {Dice} from "../dist/core/Dices";
import {CellType, DieType, IDie, IPlayableCardCell, IPlayerCard} from "../dist/core/gameplay";
import {NumberCell} from "../dist/core/Cells";
import {PlayerCard} from "../dist/core/PlayerCard";

describe("CardField", () => {
    let card: IPlayerCard;

    const cellOnes: IPlayableCardCell = new NumberCell(CellType.Ones, 1);
    const cellTwos: IPlayableCardCell = new NumberCell(CellType.Twos, 2);

    beforeEach(() => {
        card = new PlayerCard([cellOnes, cellTwos]);
    });

    it("Not finished", () => {
        assert.equal(card.finished(), false);
    });

    it("Finished", () => {
        function die1(): IDie {
            return {type: DieType.Value, value: 1};
        }

        function die2(): IDie {
            return {type: DieType.Value, value: 2};
        }

        (card.getCell(CellType.Ones) as IPlayableCardCell).setDice(new Dice(die1(), die2(), die1(), die2(), die1()));
        (card.getCell(CellType.Twos) as IPlayableCardCell).setDice(new Dice(die1(), die2(), die1(), die2(), die1()));

        assert.equal(card.finished(), true);
    });

    it("hasField()", () => {
        assert.equal(card.hasCell(CellType.Ones), true);
    });

    it("getField()", () => {
        assert.equal(card.getCell(CellType.Ones), cellOnes);
    });

    // TODO: Тесты на ошибки
});
