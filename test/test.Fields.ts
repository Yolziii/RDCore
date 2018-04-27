import * as assert from "assert";
import 'mocha';
import {Config, DieType, FieldType, IPlayableCardField} from "../src/gameplay";
import {Dice} from "../src/core/Dices";
import {ChanceField, FullHouse, KindField, NumberField, RoyalDiceField, StraightField} from "../src/core/Fields";

describe('Field', () => {
    const DIE1 = {type:DieType.Value, value:1};
    const DIE2 = {type:DieType.Value, value:2};
    const DIE3 = {type:DieType.Value, value:3};
    const DIE4 = {type:DieType.Value, value:4};
    const DIE5 = {type:DieType.Value, value:5};
    const DIE6 = {type:DieType.Value, value:6};

    describe('NumberField', () => {
        it('NumberField', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE2, DIE3, DIE4, DIE5);
            let field:IPlayableCardField = new NumberField(FieldType.Ones, 1);
            field.setDice(dice);
            assert.equal(field.value(), 1);
            assert.equal(FieldType.Ones, field.type);
        });

        it('NumberField type', () => {
            let field:IPlayableCardField = new NumberField(FieldType.Ones, 1);
            assert.equal(FieldType.Ones, field.type);
        });
    });

    describe('RoyalDice', () => {
        it('RoyalDice - 50', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE1, DIE1, DIE1, DIE1);
            let field:IPlayableCardField = new RoyalDiceField();
            field.setDice(dice);
            assert.equal(field.value(), Config.CostRoyalDice);
            assert.equal(FieldType.RoyalDice, field.type);
        });

        it('RoyalDice type', () => {
            let field:IPlayableCardField = new RoyalDiceField();
            assert.equal(FieldType.RoyalDice, field.type);
        });

        it('RoyalDice - 0', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE2, DIE3, DIE4, DIE5);
            let field:IPlayableCardField = new RoyalDiceField();
            field.setDice(dice);
            assert.equal(field.value(), 0);
        });
    });

    describe('Chance', () => {
        it('Chance - 15', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE2, DIE3, DIE4, DIE5);
            let field:IPlayableCardField = new ChanceField();
            field.setDice(dice);
            assert.equal(field.value(), 15);
        });

        it('Chance type', () => {
            let field:IPlayableCardField = new ChanceField();
            assert.equal(FieldType.Chance, field.type);
        });
    });

    describe('Kinds', () => {
        it('3 Kind - 7', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE1, DIE1, DIE2, DIE2);
            let field:IPlayableCardField = new KindField(FieldType.Kind3, 3);
            field.setDice(dice);
            assert.equal(field.value(), 7);
        });

        it('3 Kind type', () => {
            let field:IPlayableCardField = new ChanceField();
            assert.equal(FieldType.Chance, field.type);
        });

        it('3 Kind - 0', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE1, DIE2, DIE3, DIE4);
            let field:IPlayableCardField = new KindField(FieldType.Kind3, 3);
            field.setDice(dice);
            assert.equal(field.value(), 0);
        });

        it('4 Kind - 6', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE1, DIE1, DIE1, DIE2);
            let field:IPlayableCardField = new KindField(FieldType.Kind4, 4);
            field.setDice(dice);
            assert.equal(field.value(), 6);
        });
    });

    describe('FullHouse', () => {
        it('FullHouse - 25', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE1, DIE2, DIE2, DIE2);
            let field:IPlayableCardField = new FullHouse();
            field.setDice(dice);
            assert.equal(field.value(), Config.CostFullHouse);
        });

        it('FullHouse type', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE1, DIE2, DIE2, DIE2);
            let field:IPlayableCardField = new FullHouse();
            field.setDice(dice);
            assert.equal(field.value(), Config.CostFullHouse);
        });

        it('FullHouse - 0', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE1, DIE1, DIE2, DIE2, DIE3);
            let field:IPlayableCardField = new FullHouse();
            field.setDice(dice);
            assert.equal(field.value(), 0);
        });
    });

    describe('Straights', () => {
        it('SmallStraight - 30', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE2, DIE3, DIE1, DIE4, DIE6);
            let field:IPlayableCardField = new StraightField(FieldType.SmallStraight, Config.CostSmallStraight, 4);
            field.setDice(dice);
            assert.equal(field.value(), Config.CostSmallStraight);
        });

        it('SmallStraight type', () => {
            let field:IPlayableCardField = new StraightField(FieldType.SmallStraight, Config.CostSmallStraight, 4);
            assert.equal(field.type, FieldType.SmallStraight);
        });

        it('SmallStraight - 0', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE2, DIE3, DIE1, DIE5, DIE6);
            let field:IPlayableCardField = new StraightField(FieldType.SmallStraight, Config.CostSmallStraight, 4);
            field.setDice(dice);
            assert.equal(field.value(), 0);
        });

        it('LargeStraight - 40', () => {
            let dice:Dice = new Dice(Config.DefaultDiceSize, DIE2, DIE3, DIE1, DIE4, DIE5);
            let field:IPlayableCardField = new StraightField(FieldType.LargeStraight, Config.CostLargeStraight, 5);
            field.setDice(dice);
            assert.equal(field.value(), Config.CostLargeStraight);
        });
    });
});
