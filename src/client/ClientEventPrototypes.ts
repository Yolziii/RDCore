import {Protocol} from "../app/Protocol";
import {StartRoundEvent} from "../app/round/StartRoundState";
import {AppEventSetThrowedDice, RoundFillCellAppEvent, RoundIndexAppEvent} from "../app/round/remote/StatesAndEvents";

export const ClientEventPrototypes = {
    [Protocol.Round]: StartRoundEvent.prototype,
    [Protocol.RoundSetThrowedDice]: AppEventSetThrowedDice.prototype,
    [Protocol.RoundFillCell]: RoundFillCellAppEvent.prototype,
    [Protocol.RoundSelectCard]: RoundIndexAppEvent.prototype,
    [Protocol.RoundSelectPlayer]: RoundIndexAppEvent.prototype,
    [Protocol.RoundHoldDie]: RoundIndexAppEvent.prototype,
    [Protocol.RoundFreeDie]: RoundIndexAppEvent.prototype
};
