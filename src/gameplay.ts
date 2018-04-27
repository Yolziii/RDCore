export let Config = {
    DefaultDiceSize: 5,

    CostFullHouse: 25,
    CostSmallStraight: 30,
    CostLargeStraight: 30,
    CostRoyalDice: 50,
};

/**
 * Перечисляет виды ячеек в карточке игрока
 */
export const enum FieldType {
    Ones = "Ones",
    Twos = "Twos",
    Threes = "Threes",
    Fours = "Fours",
    Fives = "Fives",
    Sixes = "Sixes",

    Kind3 = "",
    Kind4 = "",
    FullHouse = "",
    SmallStraight = "SmallStraight",
    LargeStraight = "LargeStraight",
    RoyalDice = "RoyalDice",
    "Chance" = "Chance",

    ServiceTotalNumbers = "ServiceTotalNumbers",
    ServiceTotalCombinations = "ServiceTotalCombinations",
    ServiceTotalCard = "ServiceTotalCard"
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

export interface ICardField {
    type:FieldType;
    value():number;
}

export interface IPlayableCardField extends ICardField {
    dice():IDice;
    setDice(dice:IDice):void;
}

export interface IServiceCardField extends ICardField {
    linkCard(card:IPlayerCard):void;
}

export interface IPlayerCard {
    fields:ICardField[];
}

export interface IPlayer {
    id():number;
    name():string;
}

export interface IRound {
    players():IPlayer[];
}