import {ServerSideAppState} from "../../../ServerSideAppState";
import {StateSlot} from "../../../StateSlot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {IRoundObserver} from "../../../../model/coreGameplay/round/IRoundObserver";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {RoundEventIndex} from "../../../../model/coreGameplay/round/events/RoundEventIndex";
import {RoundEventType} from "../../../../model/coreGameplay/round/RoundEventType";

/** По просьбе клиента выбирает указанного игрока и сообщает об этом клиенту после того, как он выбран */
export class ServerRoundSelectPlayerState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication, model:IRound) {
        super(StateSlot.RoundSelectPlayer, appClient);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.addObserver(this);
        this.model.selectPlayer(event.index);
    }

    public  onRoundEvent(event:RoundEventIndex) {
        if (event.type === RoundEventType.SelectPlayer) {
            this.model.removeObserver(this);

            const appEvent = new RoundIndexAppEvent(StateSlot.RoundSelectPlayer, event.index);
            this.appClient.proceedEvent(appEvent);

            this.app.exitToPreviousState();
        }
    }
}
