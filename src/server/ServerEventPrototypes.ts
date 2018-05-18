import {Protocol} from "../app/Protocol";
import {
    RoundFillCellAppEvent, RoundIndexAppEvent
} from "../app/round/remote/StatesAndEvents";
import {StartRoundEvent} from "../app/round/StartRoundState";
import {RoundEventThrowedDice} from "../model/coreGameplay/round/Rounds";

export const ServerEventPrototypes = {
    [Protocol.RoundFillCell]: RoundFillCellAppEvent.prototype,
    [Protocol.RoundSelectCard]: RoundIndexAppEvent.prototype,
    [Protocol.RoundSelectPlayer]: RoundIndexAppEvent.prototype,
    [Protocol.RoundHoldDie]: RoundIndexAppEvent.prototype,
    [Protocol.RoundFreeDie]: RoundIndexAppEvent.prototype,
    [Protocol.ConfirmStartServerRound]: StartRoundEvent.prototype,
    [Protocol.RoundThrowDice]: RoundEventThrowedDice.prototype
};
