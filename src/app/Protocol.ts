export enum Protocol {
    StartApplication = 1,

    StartRound = 100,
    Round = 101,
    RoundResult = 102,
    RoundQuit = 103,

    RoundThrowDice = 110,
    RoundSetThrowedDice = 111,
    RoundHoldDie = 112,
    RoundFreeDie = 113,
    RoundSelectCard = 114,
    RoundSelectPlayer = 115,
    RoundFillCell = 116
}
