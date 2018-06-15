import {Dice} from "../coreGameplay/dice/Dice";

export abstract class ACellProbability {
    protected dice:Dice;
    protected throwsLeft:number;

    /**
     * Рассчитывает вероятность выпадения комбинации для ячейки на основе уже выброшенных костей и оставшихъся попаток
     * @param {Dice} dice - текущие кости  - сколько осталось ходов
     * @param {number} throwsLeft
     */
    public calculate(dice:Dice, throwsLeft:number):void {
        this.dice = dice;
        this.throwsLeft = throwsLeft;
    }

    /**
     * Вероятность выпадения комбинации, подходящей для ячейки
     * @returns {number}
     */
    public probability():number {
        return 0;
    }

    /**
     * Какие кубики нужно захолдить для посчитанной вероятности
     * @returns {Dice[]}
     */
    public recommendedCombinations():Dice[] {
        return [];
    }
}
