import * as assert from "assert";
import "mocha";
import {Dice, IDie, DieType} from "../src/core/Dices";
import {
    Bonus63Cell, BonusRoyalCell, BottomPointsCell, CellType,
    ChanceCell, FinalScoreCell, FullHouseCell, IPlayableCell, IServiceCell, KindCell, NumberCell, RoyalDiceCell,
    StraightCell,
    TopPointsCell,
    TotalBonusesCell,
    TotalNumbersCell, TotalNumbersWithBonusCell,
} from "../src/core/Cells";
import {Config} from "../src/core/Config";
import {ICard, Card} from "../src/core/Cards";

describe("Cells", () => {
    function die1(): IDie {
        return copy({type: DieType.Value, value: 1});
    }

    function die2(): IDie {
        return copy({type: DieType.Value, value: 2});
    }

    function die3(): IDie {
        return copy({type: DieType.Value, value: 3});
    }

    function die4(): IDie {
        return copy({type: DieType.Value, value: 4});
    }

    function die5(): IDie {
        return copy({type: DieType.Value, value: 5});
    }

    function die6(): IDie {
        return copy({type: DieType.Value, value: 6});
    }
    function copy(die: IDie): IDie {
        const newOne = {};
        for (const prop in die) {
            if (die.hasOwnProperty(prop)) {
                newOne[prop] = die[prop];
            }
        }
        return newOne as IDie;
    }

    describe("Playable cells", () => {
        describe("NumberCell", () => {
            it("NumberCell", () => {
                const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
                const cell: IPlayableCell = new NumberCell(CellType.Ones, 1);
                cell.fill(dice);
                assert.equal(cell.value, 1);
            });

            it("NumberCell type", () => {
                const cell: IPlayableCell = new NumberCell(CellType.Ones, 1);
                assert.equal(CellType.Ones, cell.type);
            });

            it("valueFor()", () => {
                const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
                const cell: IPlayableCell = new NumberCell(CellType.Ones, 1);
                assert.equal(cell.valueFor(dice), 1);
            });

            it("NumberCell type", () => {
                const cell: IPlayableCell = new NumberCell(CellType.Ones, 1);
                assert.equal(CellType.Ones, cell.type);
            });
        });

        describe("RoyalDiceCell", () => {
            it("RoyalDice - 50", () => {
                const dice: Dice = new Dice(die1(), die1(), die1(), die1(), die1());
                const cell: IPlayableCell = new RoyalDiceCell();
                cell.fill(dice);
                assert.equal(cell.value, Config.CostRoyalDice);
            });

            it("RoyalDice valueFor", () => {
                const dice: Dice = new Dice(die1(), die1(), die1(), die1(), die1());
                const cell: IPlayableCell = new RoyalDiceCell();
                assert.equal(cell.valueFor(dice), Config.CostRoyalDice);
            });

            it("RoyalDice type", () => {
                const cell: IPlayableCell = new RoyalDiceCell();
                assert.equal(CellType.RoyalDice, cell.type);
            });

            it("RoyalDice - 0", () => {
                const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
                const cell: IPlayableCell = new RoyalDiceCell();
                cell.fill(dice);
                assert.equal(cell.value, 0);
            });
        });

        describe("ChanceCell", () => {
            it("Chance - 15", () => {
                const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
                const cell: IPlayableCell = new ChanceCell();
                cell.fill(dice);
                assert.equal(cell.value, 15);
            });

            it("Chance - valueFor()", () => {
                const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
                const cell: IPlayableCell = new ChanceCell();
                assert.equal(cell.valueFor(dice), 15);
            });

            it("Chance type", () => {
                const cell: IPlayableCell = new ChanceCell();
                assert.equal(CellType.Chance, cell.type);
            });
        });

        describe("KindsCell", () => {
            it("3 Kind - 7", () => {
                const dice: Dice = new Dice(die1(), die1(), die1(), die2(), die2());
                const cell: IPlayableCell = new KindCell(CellType.Kind3, 3);
                cell.fill(dice);
                assert.equal(cell.value, 7);
            });

            it("3 Kind - valueFor", () => {
                const dice: Dice = new Dice(die1(), die1(), die1(), die2(), die2());
                const cell: IPlayableCell = new KindCell(CellType.Kind3, 3);
                assert.equal(cell.valueFor(dice), 7);
            });

            it("3 Kind type", () => {
                const cell: IPlayableCell = new KindCell(CellType.Chance, 3);
                assert.equal(CellType.Chance, cell.type);
            });

            it("3 Kind - 0", () => {
                const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
                const cell: IPlayableCell = new KindCell(CellType.Kind3, 3);
                cell.fill(dice);
                assert.equal(cell.value, 0);
            });

            it("4 Kind - 6", () => {
                const dice: Dice = new Dice(die1(), die1(), die1(), die1(), die2());
                const cell: IPlayableCell = new KindCell(CellType.Kind4, 4);
                cell.fill(dice);
                assert.equal(cell.value, 6);
            });
        });

        describe("FullHouseCell", () => {
            it("FullHouseCell - 25", () => {
                const dice: Dice = new Dice(die1(), die1(), die2(), die2(), die2());
                const cell: IPlayableCell = new FullHouseCell();
                cell.fill(dice);
                assert.equal(cell.value, Config.CostFullHouse);
            });

            it("FullHouseCell - valueFor", () => {
                const dice: Dice = new Dice(die1(), die1(), die2(), die2(), die2());
                const cell: IPlayableCell = new FullHouseCell();
                assert.equal(cell.valueFor(dice), Config.CostFullHouse);
            });

            it("FullHouseCell type", () => {
                const dice: Dice = new Dice(die1(), die1(), die2(), die2(), die2());
                const cell: IPlayableCell = new FullHouseCell();
                cell.fill(dice);
                assert.equal(cell.value, Config.CostFullHouse);
            });

            it("FullHouseCell - 0", () => {
                const dice: Dice = new Dice(die1(), die1(), die2(), die2(), die3());
                const cell: IPlayableCell = new FullHouseCell();
                cell.fill(dice);
                assert.equal(cell.value, 0);
            });
        });

        describe("StraightsCell", () => {
            it("SmallStraight - 30", () => {
                const dice: Dice = new Dice(die2(), die3(), die1(), die4(), die6());
                const cell: IPlayableCell = new StraightCell(CellType.SmallStraight, Config.CostSmallStraight, 4);
                cell.fill(dice);
                assert.equal(cell.value, Config.CostSmallStraight);
            });

            it("SmallStraight - valueFor", () => {
                const dice: Dice = new Dice(die2(), die3(), die1(), die4(), die6());
                const cell: IPlayableCell = new StraightCell(CellType.SmallStraight, Config.CostSmallStraight, 4);
                assert.equal(cell.valueFor(dice), Config.CostSmallStraight);
            });

            it("SmallStraight type", () => {
                const cell: IPlayableCell = new StraightCell(CellType.SmallStraight, Config.CostSmallStraight, 4);
                assert.equal(cell.type, CellType.SmallStraight);
            });

            it("SmallStraight - 0", () => {
                const dice: Dice = new Dice(die2(), die3(), die1(), die5(), die6());
                const cell: IPlayableCell = new StraightCell(CellType.SmallStraight, Config.CostSmallStraight, 4);
                cell.fill(dice);
                assert.equal(cell.value, 0);
            });

            it("LargeStraight - 40", () => {
                const dice: Dice = new Dice(die2(), die3(), die1(), die4(), die5());
                const cell: IPlayableCell = new StraightCell(CellType.LargeStraight, Config.CostLargeStraight, 5);
                cell.fill(dice);
                assert.equal(cell.value, Config.CostLargeStraight);
            });
        });
    });

    describe("Service cells", () => {
        let card: ICard;

        beforeEach(() => {
            card = new Card([
                new NumberCell(CellType.Ones, 1),
                new NumberCell(CellType.Twos, 2),
                new NumberCell(CellType.Threes, 3),
                new NumberCell(CellType.Fours, 4),
                new NumberCell(CellType.Fives, 5),
                new NumberCell(CellType.Sixes, 6),

                new TotalNumbersCell(),
                new Bonus63Cell(),
                new TotalNumbersWithBonusCell(),

                new KindCell(CellType.Kind3, 3),
                new KindCell(CellType.Kind4, 4),
                new FullHouseCell(),
                new StraightCell(CellType.SmallStraight, Config.CostSmallStraight, 4),
                new StraightCell(CellType.LargeStraight, Config.CostLargeStraight, 5),
                new RoyalDiceCell(),
                new ChanceCell(),

                new TopPointsCell(),
                new BottomPointsCell(),
                new BonusRoyalCell(),
                new TotalBonusesCell(),

                new FinalScoreCell(),
            ]);
        });

        describe("TotalNumbersCell", () => {
            it("Type", () => {
                assert.equal(new TotalNumbersCell().type, CellType.ServiceTotalNumbers);
            });

            it("Zero", () => {
                const totalNumbers: IServiceCell = card.getCellService(CellType.ServiceTotalNumbers);
                assert.equal(totalNumbers.value, 0);
            });

            it("1-6", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die2(), die3(), die4(), die5()));

                const totalNumbers: IServiceCell = card.getCellService(CellType.ServiceTotalNumbers);
                assert.equal(totalNumbers.value, 21);
            });
        });

        describe("Bonus63Cells", () => {
            it("Type", () => {
                assert.equal(new Bonus63Cell().type, CellType.ServiceBonus63);
            });

            it("Zero", () => {
                const amount: IServiceCell = card.getCellService(CellType.ServiceBonus63);
                assert.equal(amount.value, 0);
            });

            it("Zero bonus", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die2(), die3(), die4(), die5()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceBonus63);
                assert.equal(amount.value, 0);
            });

            it("Full bonus", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die1(), die1(), die4(), die5()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die2(), die2(), die2(), die4(), die5()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die3(), die3(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die4(), die4(), die4(), die5(), die6()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die5(), die5(), die5(), die1(), die2()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die6(), die6(), die4(), die5()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceBonus63);
                assert.equal(amount.value, Config.CostBonus63);
            });
        });

        describe("TotalNumbersWithBonusCell", () => {
            it("Type", () => {
                assert.equal(new TotalNumbersWithBonusCell().type, CellType.ServiceTotalNumbersWithBonus);
            });

            it("Zero", () => {
                const amount: IServiceCell = card.getCellService(CellType.ServiceTotalNumbersWithBonus);
                assert.equal(amount.value, 0);
            });

            it("Zero bonus", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die2(), die3(), die4(), die5()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceTotalNumbersWithBonus);
                assert.equal(amount.value, 21);
            });

            it("Full bonus", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die1(), die1(), die4(), die5()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die2(), die2(), die2(), die4(), die5()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die3(), die3(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die4(), die4(), die4(), die5(), die6()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die5(), die5(), die5(), die1(), die2()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die6(), die6(), die4(), die5()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceTotalNumbersWithBonus);
                assert.equal(amount.value, Config.CostBonus63 + 63);
            });

            // TODO: Исключение, если в карточке нет соответствующих полей
        });

        describe("Top points", () => {
            it("Type", () => {
                assert.equal(new TopPointsCell().type, CellType.ServiceTopPoints);
            });

            it("Zero", () => {
                const amount: IServiceCell = card.getCellService(CellType.ServiceTopPoints);
                assert.equal(amount.value, 0);
            });

            it("Just points", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die2(), die3(), die4(), die5()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceTopPoints);
                assert.equal(amount.value, 21);
            });

            it("Full bonus", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die1(), die1(), die4(), die5()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die2(), die2(), die2(), die4(), die5()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die3(), die3(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die4(), die4(), die4(), die5(), die6()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die5(), die5(), die5(), die1(), die2()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die6(), die6(), die4(), die5()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceTopPoints);
                assert.equal(amount.value, Config.CostBonus63 + 63);
            });
        });

        describe("Bottom points", () => {
            it("Type", () => {
                assert.equal(new BottomPointsCell().type, CellType.ServiceBottomPoints);
            });

            it("Zero", () => {
                const amount: IServiceCell = card.getCellService(CellType.ServiceBottomPoints);
                assert.equal(amount.value, 0);
            });

            it("Just playable values", () => {
                card.getCellPlayable(CellType.Kind3).fill(
                    new Dice(die1(), die1(), die1(), die2(), die2())); // 3 + 4 = 7;
                card.getCellPlayable(CellType.Kind4).fill(
                    new Dice(die1(), die1(), die1(), die1(), die2())); // 4 + 2 = 6;
                card.getCellPlayable(CellType.FullHouse).fill(new Dice(die1(), die1(), die1(), die2(), die2()));
                card.getCellPlayable(CellType.SmallStraight).fill(new Dice(die1(), die2(), die3(), die4(), die6()));
                card.getCellPlayable(CellType.LargeStraight).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.RoyalDice).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.Chance).fill(new Dice(die1(), die2(), die3(), die4(), die5())); // 15

                const amount: IServiceCell = card.getCellService(CellType.ServiceBottomPoints);
                assert.equal(amount.value, 7 + 6 + 15 +
                    Config.CostFullHouse + Config.CostSmallStraight + Config.CostLargeStraight + Config.CostRoyalDice);
            });

            it("With RD bonus", () => {
                // TODO:
            });
        });

        describe("BonusRoyal", () => {
            it("Type", () => {
                assert.equal(new BonusRoyalCell().type, CellType.ServiceBonusRoyal);
            });

            it("Zero", () => {
                const amount: IServiceCell = card.getCellService(CellType.ServiceBonusRoyal);
                assert.equal(amount.value, 0);
            });

            it("All royaldices", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die1(), die1(), die1(), die1()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die2(), die2(), die2(), die2(), die2()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die3(), die3(), die3(), die3(), die3()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die4(), die4(), die4(), die4(), die4()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die5(), die5(), die5(), die5(), die5()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.Kind3).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.Kind4).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.FullHouse).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.SmallStraight).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.LargeStraight).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.RoyalDice).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.Chance).fill(new Dice(die6(), die6(), die6(), die6(), die6()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceBonusRoyal);
                assert.equal(amount.value, Config.CostRoyalBonusPerItem * 12);
            });

            it("One royaldice doesn't matter", () => {
                card.getCellPlayable(CellType.RoyalDice).fill(new Dice(die6(), die6(), die6(), die6(), die6()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceBonusRoyal);
                assert.equal(amount.value, 0);
            });

            it("Royaldice somewhere else doesn't matter too", () => {
                card.getCellPlayable(CellType.Chance).fill(new Dice(die6(), die6(), die6(), die6(), die6()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceBonusRoyal);
                assert.equal(amount.value, 0);
            });
        });

        describe("Total bonuses", () => {
            it("Type", () => {
                assert.equal(new TotalBonusesCell().type, CellType.ServiceTotalBonuses);
            });

            it("Zero", () => {
                const amount: IServiceCell = card.getCellService(CellType.ServiceTotalBonuses);
                assert.equal(amount.value, 0);
            });

            it("Both bonuses", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die1(), die1(), die4(), die5()));
                card.getCellPlayable(CellType.Twos).fill(new Dice(die2(), die2(), die2(), die4(), die5()));
                card.getCellPlayable(CellType.Threes).fill(new Dice(die3(), die3(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.Fours).fill(new Dice(die4(), die4(), die4(), die5(), die6()));
                card.getCellPlayable(CellType.Fives).fill(new Dice(die5(), die5(), die5(), die1(), die2()));
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die6(), die6(), die4(), die5()));

                card.getCellPlayable(CellType.RoyalDice).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.Chance).fill(new Dice(die6(), die6(), die6(), die6(), die6()));

                const amount: IServiceCell = card.getCellService(CellType.ServiceTotalBonuses);
                assert.equal(amount.value, Config.CostBonus63 + Config.CostRoyalBonusPerItem);
            });
        });

        describe("Final score", () => {
            it("Type", () => {
                assert.equal(new FinalScoreCell().type, CellType.ServiceFinalScore);
            });

            it("Zero", () => {
                const amount: IServiceCell = card.getCellService(CellType.ServiceFinalScore);
                assert.equal(amount.value, 0);
            });

            it("All Points", () => {
                card.getCellPlayable(CellType.Ones).fill(new Dice(die1(), die1(), die1(), die4(), die5()));   // 3
                card.getCellPlayable(CellType.Twos).fill(new Dice(die2(), die2(), die2(), die4(), die5()));   // 6
                card.getCellPlayable(CellType.Threes).fill(new Dice(die3(), die3(), die3(), die4(), die5())); // 9
                card.getCellPlayable(CellType.Fours).fill(new Dice(die4(), die4(), die4(), die5(), die6()));  // 12
                card.getCellPlayable(CellType.Fives).fill(new Dice(die5(), die5(), die5(), die1(), die2()));  // 15
                card.getCellPlayable(CellType.Sixes).fill(new Dice(die6(), die6(), die6(), die4(), die5()));  // 18

                card.getCellPlayable(CellType.Kind3).fill(
                    new Dice(die1(), die1(), die1(), die2(), die2())); // 3 + 4 = 7;
                card.getCellPlayable(CellType.Kind4).fill(
                    new Dice(die1(), die1(), die1(), die1(), die2())); // 4 + 2 = 6;
                card.getCellPlayable(CellType.FullHouse).fill(new Dice(die1(), die1(), die1(), die2(), die2()));
                card.getCellPlayable(CellType.SmallStraight).fill(new Dice(die1(), die2(), die3(), die4(), die6()));
                card.getCellPlayable(CellType.LargeStraight).fill(new Dice(die1(), die2(), die3(), die4(), die5()));
                card.getCellPlayable(CellType.RoyalDice).fill(new Dice(die6(), die6(), die6(), die6(), die6()));
                card.getCellPlayable(CellType.Chance).fill(new Dice(die6(), die6(), die6(), die6(), die6())); // 30

                const amount: IServiceCell = card.getCellService(CellType.ServiceFinalScore);
                assert.equal(amount.value, 63 + 7 + 6 + 30 +
                    Config.CostBonus63 + Config.CostFullHouse +
                    Config.CostSmallStraight + Config.CostLargeStraight + Config.CostRoyalDice +
                    Config.CostRoyalBonusPerItem);
            });
        });
    });
});
