export let Config = {
    DefaultDiceSize: 5,

    CostFullHouse: 25,
    CostSmallStraight: 30,
    CostLargeStraight: 30,
    CostRoyalDice: 50,
    CostBonus63: 35,
    CostRoyalBonusPerItem: 100,
};

/**
 * Виды ячеек в карточке игрока
 */
export const enum CellType {
    Ones = "Ones",
    Twos = "Twos",
    Threes = "Threes",
    Fours = "Fours",
    Fives = "Fives",
    Sixes = "Sixes",

    Kind3 = "Kind3",
    Kind4 = "Kind4",
    FullHouse = "FullHouse",
    SmallStraight = "SmallStraight",
    LargeStraight = "LargeStraight",
    RoyalDice = "RoyalDice",
    Chance = "Chance",

    ServiceTotalNumbers = "ServiceTotalNumbers",
    ServiceBonus63 = "ServiceBonus63",
    ServiceTotalNumbersWithBonus = "ServiceTotalNumbersWithBonus",

    ServiceTopPoints = "ServiceTopPoints",
    ServiceBottomPoints = "ServiceBottomPoints",

    ServiceBonusRoyal = "ServiceBonusRoyal",
    ServiceTotalBonuses = "ServiceTotalBonuses",

    ServiceFinalScore = "ServiceFinalScore",
}

/**
 * Виды костей
 */
export const enum DieType {
    Value = "Value",
    Jocker = "Jocker",
    Unknown = "Unknown",
    Blocked = "Blocked"
}

/**
 * Места, где могут находиться кости
 */
export const enum DicePlaceType {
    Nowhere = "Nowhere",
    Table = "Table",
    Slot = "Slot",
    CardField = "CardField"
}

/**
 * Одна кость
 */
export interface IDie {
    type:DieType;
    value:number;
}

/**
 * Набор костей
 */
export interface IDice {
    max():number;
    total():number;

    isFull():Boolean;

    put(die:IDie, index:number):void;
    pop(index):IDie;
    get(index):IDie;
}

export interface ICardCell {
    type:CellType;
    value():number;
}

export interface IPlayableCardCell extends ICardCell {
    isFull():Boolean;
    dice():IDice;
    setDice(dice:IDice):void;
}

export interface IServiceCardCell extends ICardCell {
    linkCard(card:IPlayerCard):void;
}

export interface IPlayerCard {
    finished();

    hasCell(type:CellType):boolean;
    getCell(type:CellType):IPlayableCardCell | IServiceCardCell;
    getCellPlayable(type:CellType):IPlayableCardCell;
    getCellService(type:CellType):IServiceCardCell;
}

export interface IPlayer {
    id():number;
    name():string;
}

export interface IRound {
    finished();
}

export interface IPlayerCommand {
    execute();
}