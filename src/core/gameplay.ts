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

export const enum DieType {
    Value = "Value",
    Jocker = "Jocker",
    Unknown = "Unknown",
    Blocked = "Blocked",
}

export const enum DicePlaceType {
    Nowhere = "Nowhere",
    Table = "Table",
    Slot = "Slot",
    CardField = "CardField",
}

export interface IDie {
    type: DieType;
    value: number;
}

export interface IDice {
    max(): number;

    total(): number;

    isFull(): boolean;

    put(die: IDie, index: number): void;

    pop(index): IDie;

    get(index): IDie;
}

export interface ICardCell {
    type: CellType;

    value(): number;
}

export interface IPlayableCardCell extends ICardCell {
    isFull(): boolean;

    dice(): IDice;

    setDice(dice: IDice): void;
}

export interface IServiceCardCell extends ICardCell {
    linkCard(card: IPlayerCard): void;
}

export interface IPlayerCard {
    finished();

    hasCell(type: CellType): boolean;

    getCell(type: CellType): IPlayableCardCell | IServiceCardCell;

    getCellPlayable(type: CellType): IPlayableCardCell;

    getCellService(type: CellType): IServiceCardCell;
}

export interface IPlayer {
    id(): number;

    name(): string;
}

export interface ITeam {
    color(): number;

    totalPlayers(): number;
}

export interface IRound {
    finished();
}

export interface ICommand {
    execute();
}
