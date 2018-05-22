import {Slot} from "../app/Protocol";
import {StartRoundEvent} from "../app/round/StartRoundState";
import {AppEventSetThrowedDice, RoundFillCellAppEvent, RoundIndexAppEvent} from "../app/round/remote/StatesAndEvents";
import {AppEventPlayerAuthentication} from "../app/mainScreen/ServerPlayerAuthentification";

export const ClientEventPrototypes = {
    [Slot.Round]: StartRoundEvent.prototype,
    [Slot.RoundSetThrowedDice]: AppEventSetThrowedDice.prototype,
    [Slot.RoundFillCell]: RoundFillCellAppEvent.prototype,
    [Slot.RoundSelectCard]: RoundIndexAppEvent.prototype,
    [Slot.RoundSelectPlayer]: RoundIndexAppEvent.prototype,
    [Slot.RoundHoldDie]: RoundIndexAppEvent.prototype,
    [Slot.RoundFreeDie]: RoundIndexAppEvent.prototype,
    [Slot.PlayerAuthentication]: AppEventPlayerAuthentication.prototype
};
