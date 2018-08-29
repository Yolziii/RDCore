import {StateSlot} from "../StateSlot";
import {AppEventPlayerAuthentication} from "../events/AppEventPlayerAuthentication";
import {RoundFillCellAppEvent} from "../events/round/RoundFillCellAppEvent";
import {RoundIndexAppEvent} from "../events/round/RoundIndexAppEvent";
import {StartRoundEvent} from "../events/round/StartRoundEvent";
import {RoundEventThrowedDice} from "../../model/coreGameplay/round/events/RoundEventThrowedDice";

export const ServerEventPrototypes = {
    [StateSlot.RoundFillCell]: RoundFillCellAppEvent.prototype,
    [StateSlot.RoundSelectCard]: RoundIndexAppEvent.prototype,
    [StateSlot.RoundSelectPlayer]: RoundIndexAppEvent.prototype,
    [StateSlot.RoundHoldDie]: RoundIndexAppEvent.prototype,
    [StateSlot.RoundFreeDie]: RoundIndexAppEvent.prototype,
    [StateSlot.ConfirmStartServerRound]: StartRoundEvent.prototype,
    [StateSlot.RoundThrowDice]: RoundEventThrowedDice.prototype,
    [StateSlot.PlayerAuthentication]: AppEventPlayerAuthentication.prototype
};
