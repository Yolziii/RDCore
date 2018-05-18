import {
    AppEvent, AppState, ClientSideAppState, IDeserializer, IRemoteApplication, ISerializable,
    ServerSideAppState
} from "../../Application";
import {
    IRound, IRoundObserver, RoundEventFillCell, RoundEventIndex, RoundEventThrowedDice,
    RoundEventType
} from "../../../model/coreGameplay/round/Rounds";
import {Dice, IDice} from "../../../model/coreGameplay/Dices";
import {Protocol} from "../../Protocol";
import {CellType} from "../../../model/coreGameplay/Cells";

/**
 * Описывает брошенные игроком кости
 */
export class AppEventSetThrowedDice extends AppEvent implements ISerializable {
    public dice:IDice;

    constructor(dice:IDice) {
        super(Protocol.RoundSetThrowedDice);
    }

    public toJSON(): any {
        const json = Object.assign({}, this);
        json.dice = this.dice.toJSON();
        return json;
    }
}

/**
 * По запросу клиента бросает кости в серверной модели и отправляет клиенту результат, когда они брошены
 */
export class ServerRoundThrowDiceState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(clientApp:IRemoteApplication) {
        super(Protocol.RoundThrowDice, clientApp);
    }

    public link(model:IRound) {
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

/** Передает модели брошенные сервером кости */
export class ClientSetThrowedDiceState extends AppState implements IDeserializer {
    private model:IRound;

    constructor() {
        super(Protocol.RoundSetThrowedDice);
    }

    public link(model:IRound) {
        this.model = model;
    }

    public activate(event:AppEventSetThrowedDice) {
        this.model.setThrowedDice(event.dice);
        this.app.exitToPreviousState();
    }

    public fromJSON(json: any): AppEventSetThrowedDice {
        const event = Object.create(AppEventSetThrowedDice.prototype);
        json.dice = Dice.fromJSON(json.dice);
        return Object.create(event, json);
    }
}

/** Общий класс для всх сообщений, использующих один индекс в качестве данных */
export class RoundIndexAppEvent extends AppEvent {
    public index:number;

    constructor(slot:Protocol, index:number) {
        super(slot);
        this.index = index;
    }
}

/** Обрабатывает запрос от клиента на сохранение кости */
export class ServerRoundHoldDieState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication, model:IRound) {
        super(Protocol.RoundHoldDie, appClient);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        if (this.model.canHoldDie(event.index)) {
            this.model.addObserver(this);
            this.model.holdDie(event.index);
        } else {
            // TODO: Исключение + полностью обновлять состояние клиента
        }
    }

    public  onRoundEvent(event:RoundEventIndex) {
        if (event.type === RoundEventType.Hold) {
            this.model.removeObserver(this);

            const appEvent = new RoundIndexAppEvent(Protocol.RoundHoldDie, event.index);
            this.appClient.proceedEvent(appEvent);
        }
    }
}

/** Сохраняет кость с указанным индексом по запросу сервера */
export class ClientRoundHoldDieState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication, model:IRound) {
        super(Protocol.RoundHoldDie, appServer);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        if (this.model.canHoldDie(event.index)) {
            this.model.holdDie(event.index);
        } else {
            // TODO: Исключение + запрашивать у сервера полное обновление состояния
        }
    }
}

/** Обрабатывает запрос от клиента на освобождение кости */
export class ServerRoundFreeDieState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication, model:IRound) {
        super(Protocol.RoundFreeDie, appClient);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        if (this.model.canFreeDie(event.index)) {
            this.model.addObserver(this);
            this.model.freeDie(event.index);
        } else {
            // TODO: Исключение + полностью обновлять состояние клиента
        }
    }

    public  onRoundEvent(event:RoundEventIndex) {
        if (event.type === RoundEventType.Free) {
            this.model.removeObserver(this);

            const appEvent = new RoundIndexAppEvent(Protocol.RoundFreeDie, event.index);
            this.appClient.proceedEvent(appEvent);
        }
    }
}

/** Освобождает кость с указанным индексом по запросу сервера */
export class ClientRoundFreeDieState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication, model:IRound) {
        super(Protocol.RoundFreeDie, appServer);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        if (this.model.canFreeDie(event.index)) {
            this.model.freeDie(event.index);
        } else {
            // TODO: Исключение + запрашивать у сервера полное обновление состояния
        }
    }
}

/** По просьбе клиента выбирает указанную карточку игрока и сообщает об этой клиенту после того, как она выбрана */
export class ServerRoundSelectCardState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication, model:IRound) {
        super(Protocol.RoundSelectCard, appClient);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.addObserver(this);
        this.model.selectCard(event.index);
    }

    public  onRoundEvent(event:RoundEventIndex) {
        if (event.type === RoundEventType.SelectCard) {
            this.model.removeObserver(this);

            const appEvent = new RoundIndexAppEvent(Protocol.RoundSelectCard, event.index);
            this.appClient.proceedEvent(appEvent);
        }
    }
}

/** Выбарет указанную карточку по указанию сервера */
export class ClientRoundSelectCardState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication, model:IRound) {
        super(Protocol.RoundSelectCard, appServer);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.selectCard(event.index);
    }
}

/** По просьбе клиента выбирает указанного игрока и сообщает об этом клиенту после того, как он выбран */
export class ServerRoundSelectPlayerState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication, model:IRound) {
        super(Protocol.RoundSelectPlayer, appClient);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.addObserver(this);
        this.model.selectPlayer(event.index);
    }

    public  onRoundEvent(event:RoundEventIndex) {
        if (event.type === RoundEventType.SelectPlayer) {
            this.model.removeObserver(this);

            const appEvent = new RoundIndexAppEvent(Protocol.RoundSelectPlayer, event.index);
            this.appClient.proceedEvent(appEvent);
        }
    }
}

/** Выбарет указанного игрока по указанию сервера */
export class ClientRoundSelectPlayerState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication, model:IRound) {
        super(Protocol.RoundSelectPlayer, appServer);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.selectPlayer(event.index);
    }
}

export class RoundFillCellAppEvent extends AppEvent {
    public cellType:CellType;

    constructor(cellType:CellType) {
        super(Protocol.RoundFillCell);
        this.cellType = cellType;
    }
}

/** По просбе клиента заполнячет указанную карточку с сообщает об этом клиенту */
export class ServerRoundFillCellState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication, model:IRound) {
        super(Protocol.RoundFillCell, appClient);
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
        }
    }
}

/** Заполняет указанную карточку по просьбе сервера */
export class ClientRoundFillCellState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication, model:IRound) {
        super(Protocol.RoundFillCell, appServer);
        this.model = model;
    }

    public activate(event:RoundFillCellAppEvent) {
        this.model.fillCell(event.cellType);
    }
}
