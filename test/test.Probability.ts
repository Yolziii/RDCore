import * as assert from "assert";
import "mocha";
import {calculateCombinations, PDie} from "../src/model/probability/PDie";
import {round} from "../src/model/probability/round";

describe("Probability", () => {
    describe("One die", () => {
        it("Probability of 0", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.faceProbability(0)), 0);
        });

        it("Probability of 7", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.faceProbability(7)), 0);
        });

        it("Probability of 1", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.faceProbability(1)), 0.1667);
        });

        it("Probability of 6", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.faceProbability(6)), 0.1667);
        });

        it("Not roundedProbability of 6", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.faceProbability(6), 0.16666666666666666);
        });
    });

    describe("Few die", () => {
        it("Probability of two dices", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2)), 0.3333);
        });

        it("Probability of three dices", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2, 3)), 0.5);
        });

        it("Probability of four", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2, 3, 4)), 0.6667);
        });

        it("Probability of five", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2, 3, 4, 5)), 0.8333);
        });

        it("Probability of six", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2, 3, 4, 5, 6)), 1);
        });
    });

    describe("Combinations", () => {
        it("Combinations of 1-1", () => {
            assert.deepEqual(calculateCombinations([1, 1]), [[1,1]]);
        });

        it("Combinations of 1-2", () => {
            assert.deepEqual(calculateCombinations([2, 1]), [[1,2], [2,1]]);
        });

        it("Combinations of 1-1-2", () => {
            assert.deepEqual(calculateCombinations([1, 1, 2]), [[1,1,2], [1,2,1], [2,1,1]]);
        });

        it("Combinations of 1-2-3", () => {
            assert.deepEqual(calculateCombinations([1, 2, 3]), [ [1,2,3 ], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] ]);
        });
    });

    describe("Probability of combination", () => {
        it("Probability of 1-1", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 1)), 0.0278);
        });

        it("Probability of 1-2", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 2)), 0.0556);
        });

        it("Probability of 1-1-1", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 1, 1)), 0.0046);
        });

        it("Probability of 1-1-2", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 1, 2)), 0.0139);
        });

        it("Probability of 1-2-3", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 2, 3)), 0.0278);
        });
    });

    describe("Probability of template", () => {
        it("Probability of 1-1", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.templateProbability2("1", "1")), 0.0278);
        });

        it("Probability of 1-X", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.templateProbability2("1", "[123456]")), round(11/36));
        });

        it("Probability of 6-6-7", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability2("6", "6", "6"), 1/216);
        });

        it("Probability of 6-6-X", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability2("6", "6", "[123456]"), 16/216);
        });

        it("Probability of 6-6-!6", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability2("6", "6", "[12345]"), 15/216);
        });

        it("Probability of 6-!6-!6", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability2("6", "a|[12345]", "b|[12345]"), 75/216);
        });

        it("Probability of !6-!6-!6", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability2("a|[12345]", "b|[12345]", "c|[12345]"), 125/216);
        });
    });
});
