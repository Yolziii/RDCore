import * as assert from "assert";
import 'mocha';
import {Dice, FullDiceDecorator} from "../src/core/Dices";
import {Config, DieType, IDice, IDie} from "../src/gameplay";
import RDError, {RDErrorCode} from "../src/core/RDError";

describe('Dices', () => {
    it('Max', () => {
        let dice:Dice = new Dice(5);
        assert.equal(dice.max(), 5);
    });

    it('Zero total', () => {
        let dice:Dice = new Dice(5);
        assert.equal(dice.total(), 0);
    });

    it('Not full', () => {
        let dice:Dice = new Dice(5);
        assert.equal(dice.isFull(), false);
    });

    it('One total', () => {
        let dice:Dice = new Dice(Config.DefaultDiceSize, {type:DieType.Value, value:1});
        assert.equal(dice.total(), 1);
    });

    it('Full', () => {
        let dice:Dice = new Dice(
            Config.DefaultDiceSize,
            {type:DieType.Value, value:1}, {type:DieType.Value, value:2}, {type:DieType.Value, value:3}, {type:DieType.Value, value:4}, {type:DieType.Value, value:5});
        assert.equal(dice.isFull(), true);
    });

    it('value()', () => {
        let dice:Dice = new Dice(
            Config.DefaultDiceSize,
            {type:DieType.Value, value:1}, {type:DieType.Value, value:2}, {type:DieType.Value, value:3}, {type:DieType.Value, value:4}, {type:DieType.Value, value:5});
        assert.equal(dice.total(), 5);
    });

    it('get()', () => {
        let dice:Dice = new Dice(5, {type:DieType.Value, value:1});
        let die:IDie = dice.get(0);
        assert.equal(die.value, 1);
        assert.equal(dice.total(), 1);
    });

    it('pop()', () => {
        let dice:Dice = new Dice(
            Config.DefaultDiceSize,
            {type:DieType.Value, value:1}, {type:DieType.Value, value:2}, {type:DieType.Value, value:3}, {type:DieType.Value, value:4}, {type:DieType.Value, value:5});
        let die:IDie = dice.pop(0);
        assert.equal(die.value, 1);
        assert.equal(dice.total(), 4);
    });

    it('Dice.put()', () => {
        let dice:Dice = new Dice(5);

        dice.put({type:DieType.Value, value:1});
        assert.equal(dice.total(), 1);

    });

    it('get() unknown', () => {
        let dice:Dice = new Dice(Config.DefaultDiceSize);
        try {
            dice.get(0);
            assert.fail("Dice.get() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_EMPTY);
            } else {
                throw e;
            }
        }
    });

    it('get() unknown', () => {
        let dice:Dice = new Dice(Config.DefaultDiceSize);
        try {
            dice.pop(0);
            assert.fail("Dice.pop() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_EMPTY);
            } else {
                throw e;
            }
        }
    });

    it('DiceArray.put() full', () => {
        let dice:Dice = new Dice(
            Config.DefaultDiceSize,
            {type:DieType.Value, value:1}, {type:DieType.Value, value:2}, {type:DieType.Value, value:3}, {type:DieType.Value, value:4}, {type:DieType.Value, value:5});
        try {
            dice.put({type:DieType.Value, value:1});
            assert.fail("Dice.put() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_IF_FULL);
            } else {
                throw e;
            }
        }
    });

    it('DiceSlotable.put() full', () => {
        let dice:Dice = new Dice(Config.DefaultDiceSize, {type:DieType.Value, value:1});
        try {
            dice.put({type:DieType.Value, value:1}, 0);
            assert.fail("DiceSlotable.put() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_FULL);
            } else {
                throw e;
            }
        }
    });

    it('FullDiceDecorator exeption', () => {
        let dice:IDice = new FullDiceDecorator(new Dice(Config.DefaultDiceSize, {type:DieType.Value, value:1}));
        try {
            dice.get(0);
            assert.fail("FullDiceDecorator.get() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_NOT_FULL);
            } else {
                throw e;
            }
        }
    });

    it('FullDiceDecorator ok', () => {
        let dice:IDice = new FullDiceDecorator(
            new Dice(
                Config.DefaultDiceSize,
                {type:DieType.Value, value:1}, {type:DieType.Value, value:2}, {type:DieType.Value, value:3}, {type:DieType.Value, value:4}, {type:DieType.Value, value:5})
        );

        let die: IDie = dice.get(0);
        assert.equal(die.value, 1);
    });
});