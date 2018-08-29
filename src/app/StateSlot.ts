export enum StateSlot {
    StartingClient = 1,
    MainScreen = 2,

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
    RoundFillCell = 116,

    // --------------------------------------------------
    // Слоты на стороне сервера
    // --------------------------------------------------
    WaitForClient = -1,
    PlayerAuthentication = -2,

    ConfirmStartServerRound = -100,
}
