import {Slot} from "../Slot";
import {AppEventPlayerAuthentication} from "../events/AppEventPlayerAuthentication";
import {RoundFillCellAppEvent} from "../events/round/RoundFillCellAppEvent";
import {RoundIndexAppEvent} from "../events/round/RoundIndexAppEvent";
import {StartRoundEvent} from "../events/round/StartRoundEvent";
import {RoundEventThrowedDice} from "../../model/coreGameplay/round/events/RoundEventThrowedDice";

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
