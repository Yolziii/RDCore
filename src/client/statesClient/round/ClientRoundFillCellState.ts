import {AppEventSetThrowedDice} from "../../../events/round/AppEventSetThrowedDice";
import {RoundFillCellAppEvent} from "../../../events/round/RoundFillCellAppEvent";
import {Slot} from "../../../app/Slot";
import {IRemoteApplication} from "../../../app/IRemoteApplication";
import {ClientSideAppState} from "../../../app/ClientSideAppState";
import {CellType} from "../../../model/coreGameplay/cells/CellType";
import {IRound} from "../../../model/coreGameplay/round/IRound";

/** Заполняет указанную карточку по просьбе сервера */
export class ClientRoundFillCellState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication) {
        super(Slot.RoundFillCell, appServer);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:RoundFillCellAppEvent) {
        this.model.fillCell(event.cellType);
        this.app.exitToPreviousState();
    }

    public fromJSON(json: any): AppEventSetThrowedDice {
        const event = Object.create(AppEventSetThrowedDice.prototype);
        event.cellType = json.cellType as CellType;
        return Object.assign(event, json);
    }
}
