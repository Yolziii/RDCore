import {AppEventSetThrowedDice} from "../../../events/round/AppEventSetThrowedDice";
import {ServerSideAppState} from "../../../ServerSideAppState";
import {RoundFillCellAppEvent} from "../../../events/round/RoundFillCellAppEvent";
import {StateSlot} from "../../../StateSlot";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {CellType} from "../../../../model/coreGameplay/cells/CellType";
import {IRoundObserver} from "../../../../model/coreGameplay/round/IRoundObserver";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {RoundEventFillCell} from "../../../../model/coreGameplay/round/events/RoundEventFillCell";
import {RoundEventType} from "../../../../model/coreGameplay/round/RoundEventType";

/** По просбе клиента заполнячет указанную карточку с сообщает об этом клиенту */
export class ServerRoundFillCellState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication) {
        super(StateSlot.RoundFillCell, appClient);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:RoundFillCellAppEvent) {
        this.model.addObserver(this);
        this.model.fillCell(event.cellType);
    }

    public  onRoundEvent(event:RoundEventFillCell) {
        if (event.type === RoundEventType.FillCell) {
            this.model.removeObserver(this);

            const appEvent = new RoundFillCellAppEvent(event.cellType);
            this.appClient.proceedEvent(appEvent);

            this.app.exitToPreviousState();
        }
    }

    public fromJSON(json: any): AppEventSetThrowedDice {
        const event = Object.create(AppEventSetThrowedDice.prototype);
        event.cellType = json.cellType as CellType;
        return Object.assign(event, json);
    }
}
