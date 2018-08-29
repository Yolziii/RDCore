import {StartRoundEvent} from "../events/round/StartRoundEvent";
import {RoundFillCellAppEvent} from "../events/round/RoundFillCellAppEvent";
import {RoundIndexAppEvent} from "../events/round/RoundIndexAppEvent";
import {AppEventSetThrowedDice} from "../events/round/AppEventSetThrowedDice";
import {StateSlot} from "../StateSlot";
import {AppEventPlayerAuthentication} from "../events/AppEventPlayerAuthentication";

export const ClientEventPrototypes = {
    [StateSlot.Round]: StartRoundEvent.prototype,
    [StateSlot.RoundSetThrowedDice]: AppEventSetThrowedDice.prototype,
    [StateSlot.RoundFillCell]: RoundFillCellAppEvent.prototype,
    [StateSlot.RoundSelectCard]: RoundIndexAppEvent.prototype,
    [StateSlot.RoundSelectPlayer]: RoundIndexAppEvent.prototype,
    [StateSlot.RoundHoldDie]: RoundIndexAppEvent.prototype,
    [StateSlot.RoundFreeDie]: RoundIndexAppEvent.prototype,
    [StateSlot.PlayerAuthentication]: AppEventPlayerAuthentication.prototype
};
