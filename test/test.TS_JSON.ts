import * as assert from "assert";
import "mocha";
import {AppEvent} from "../src/app/Application";
import {Dice, DieType, IDice} from "../src/model/coreGameplay/Dices";
import {autoserialize, serialize} from "cerialize";

describe("Serialize AppState", () => {
    class TestAppEvent1 extends AppEvent {
        private index:number;

        constructor(index:number) {
            super(1001);
            this.index = index;
        }
    }

    class TestAppEvent2 extends TestAppEvent1 {
        private value:string;

        constructor(index:number, value:string) {
            super(index);
            this.value = value;
        }
    }

    class TestAppEvent3 extends AppEvent {

        private dice:Dice;

        constructor(dice:Dice) {
            super(1002);
            this.dice = dice;
        }
    }

    beforeEach(() => {
        //
    });

    describe("toJSON", () => {
        it("simple", () => {
            const simpleEvent = new TestAppEvent1(25);
            const json = simpleEvent.toJSON();

            assert.equal(json.index, 25);
            assert.equal(json.slot, 1001);
        });

        it("subclass", () => {
            const simpleEvent = new TestAppEvent2(25, "hi");
            const json = simpleEvent.toJSON();

            assert.equal(json.index, 25);
            assert.equal(json.value, "hi");
            assert.equal(json.slot, 1001);
        });

        it("dice", () => {
            const dice:Dice = new Dice({type: DieType.Value, value: 3}, {type: DieType.Joker, value: 0});
            const diceEvent = new TestAppEvent3(dice);
            const json = diceEvent.toJSON();


        });
    });

    describe("Interactions", () => {
        //
    });
});
