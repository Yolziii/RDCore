import {StartRoundEvent} from "../events/round/StartRoundEvent";
import {RoundFillCellAppEvent} from "../events/round/RoundFillCellAppEvent";
import {RoundIndexAppEvent} from "../events/round/RoundIndexAppEvent";
import {AppEventSetThrowedDice} from "../events/round/AppEventSetThrowedDice";
import {Slot} from "../Slot";
import {AppEventPlayerAuthentication} from "../events/AppEventPlayerAuthentication";

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
