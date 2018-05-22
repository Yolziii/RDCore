import {Slot} from "../app/Protocol";
import {
    RoundFillCellAppEvent, RoundIndexAppEvent
} from "../app/round/remote/StatesAndEvents";
import {StartRoundEvent} from "../app/round/StartRoundState";
import {RoundEventThrowedDice} from "../model/coreGameplay/round/Rounds";
import {AppEventPlayerAuthentication} from "../app/mainScreen/ServerPlayerAuthentification";

export const ServerEventPrototypes = {
    [Slot.RoundFillCell]: RoundFillCellAppEvent.prototype,
    [Slot.RoundSelectCard]: RoundIndexAppEvent.prototype,
    [Slot.RoundSelectPlayer]: RoundIndexAppEvent.prototype,
    [Slot.RoundHoldDie]: RoundIndexAppEvent.prototype,
    [Slot.RoundFreeDie]: RoundIndexAppEvent.prototype,
    [Slot.ConfirmStartServerRound]: StartRoundEvent.prototype,
    [Slot.RoundThrowDice]: RoundEventThrowedDice.prototype,
    [Slot.PlayerAuthentication]: AppEventPlayerAuthentication.prototype
};
