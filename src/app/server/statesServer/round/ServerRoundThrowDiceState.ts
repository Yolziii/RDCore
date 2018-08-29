import {ServerSideAppState} from "../../../ServerSideAppState";
import {StateSlot} from "../../../StateSlot";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {AppEventSetThrowedDice} from "../../../events/round/AppEventSetThrowedDice";
import {IRoundObserver} from "../../../../model/coreGameplay/round/IRoundObserver";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {RoundEventThrowedDice} from "../../../../model/coreGameplay/round/events/RoundEventThrowedDice";
import {RoundEventType} from "../../../../model/coreGameplay/round/RoundEventType";

/**
 * По запросу клиента бросает кости в серверной модели и отправляет клиенту результат, когда они брошены
 */
export class ServerRoundThrowDiceState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(clientApp:IRemoteApplication) {
        super(StateSlot.RoundThrowDice, clientApp);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate() {
        this.model.addObserver(this);
        this.model.throwDice();
    }

    public onRoundEvent(event:RoundEventThrowedDice) {
        if (event.type === RoundEventType.Throw) {
            this.model.removeObserver(this);

            const appEvent = new AppEventSetThrowedDice(event.dice);

            this.appClient.proceedEvent(appEvent);
            this.app.exitToPreviousState();
        }
    }
}
