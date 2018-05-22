import {Slot} from "../app/Slot";
import {AppEventPlayerAuthentication} from "../events/AppEventPlayerAuthentication";
import {StartRoundEvent} from "../events/round/StartRoundEvent";
import {AppEventSetThrowedDice} from "../events/round/AppEventSetThrowedDice";
import {RoundFillCellAppEvent} from "../events/round/RoundFillCellAppEvent";
import {RoundIndexAppEvent} from "../events/round/RoundIndexAppEvent";

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
