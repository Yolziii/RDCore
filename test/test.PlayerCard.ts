import * as assert from "assert";
import 'mocha';
import {Config, DieType, CellType, IDice, IPlayableCardCell, IPlayerCard, IDie} from "../src/gameplay";
import {NumberCell} from "../src/core/Cells";
import {PlayerCard} from "../src/core/PlayerCard";
import {Dice} from "../src/core/Dices";

describe('CardField', () => {
    let card:IPlayerCard;

    let cellOnes:IPlayableCardCell = new NumberCell(CellType.Ones, 1);
    let cellTwos:IPlayableCardCell = new NumberCell(CellType.Twos, 2);

    beforeEach(function () {
        card = new PlayerCard([cellOnes, cellTwos]);
    });

    it('Not finished', () => {
        assert.equal(card.finished(), false);
    });

    it('Finished', () => {
        function die1():IDie { return {type:DieType.Value, value:1}}
        function die2():IDie { return {type:DieType.Value, value:2}}

        (<IPlayableCardCell>card.getCell(CellType.Ones)).setDice(new Dice(die1(), die2(), die1(), die2(), die1()));
        (<IPlayableCardCell>card.getCell(CellType.Twos)).setDice(new Dice(die1(), die2(), die1(), die2(), die1()));

        assert.equal(card.finished(), true);
    });

    it('hasField()', () => {
        assert.equal(card.hasCell(CellType.Ones), true);
    });

    it('getField()', () => {
        assert.equal(card.getCell(CellType.Ones), cellOnes);
    });

    // TODO: Тесты на ошибки
});
