import {Logger} from "../../util/logger/Logger";
import {IRemoteApplication} from "../IRemoteApplication";
import {ILocalApplication} from "../ILocalApplication";
import {Slot} from "../Slot";
import {IAppEvent} from "../IAppEvent";
import {IAppState} from "../IAppState";

export interface ISocket {
    on(message:string, handler);
    removeAllListeners(message:string);
    emit(message:string, params?);
}

export class ClientConnection implements IRemoteApplication {
    private clientSocket: ISocket;
    private clientId: string;
    private appMirror: ILocalApplication;

    constructor(socket: ISocket, client: ILocalApplication) {
        this.clientSocket = socket;
        this.appMirror = client;

        Logger.info("Connected client");
        this.linkCurrentSocket();
    }

    public linkClientId(id: string) {
        Logger.info("New client id: %s", id);
        this.clientId = id;
    }

    public changeSocket(socket:ISocket) {
        Logger.warning("Client #%s changed connection", this.id);
        this.unlinkCurrentSocket();
        this.linkCurrentSocket();
    }

    public get id():string {
        return this.clientId;
    }

    public toState(slot:Slot) {
        Logger.debug(`[toState] ${slot} -> (${this.clientId})`);
        this.clientSocket.emit("toState", slot);
    }

    public proceedEvent(event:IAppEvent) {
        const json = event.toJSON();

        Logger.debug(`[proceedEvent] ${JSON.stringify(json)} -> (${this.clientId})`);
        this.clientSocket.emit("proceedEvent", json);
    }

    public exitToState(slot:Slot) {
        Logger.debug(`[exitToState] ${slot} -> (${this.clientId})`);
        this.clientSocket.emit("exitToState", slot);
    }

    public proceedExitToEvent(event:IAppEvent) {
        const json = event.toJSON();

        Logger.debug(`[proceedExitToEvent] ${JSON.stringify(json)} -> (${this.clientId})`);
        this.clientSocket.emit("proceedExitToEvent", json);
    }

    public exitToPreviousState() {
        Logger.debug(`[exitToPreviousState] -> (${this.clientId})`);
        this.clientSocket.emit("exitToPreviousState");
    }

    private linkCurrentSocket() {
        const self = this;

        this.clientSocket.on("disconnect", () => {
            Logger.warning("Client #%s disconnected", self.clientId);
        });

        this.clientSocket.on("toState", (slot) => {
            Logger.debug(`(${self.clientId}) -> [toState] ${slot}`);
            self.appMirror.toState(slot);
        });

        this.clientSocket.on("proceedEvent", (eventSJON) => {
            Logger.debug(`(${self.clientId}) -> [proceedEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = self.appMirror.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            self.appMirror.proceedEvent(event);
        });

        this.clientSocket.on("exitToState", (slot) => {
            Logger.debug(`(${self.clientId}) -> [exitToState] ${slot}`);

            self.appMirror.exitToState(slot);
        });

        this.clientSocket.on("proceedExitToEvent", (eventSJON) => {
            Logger.debug(`(${self.clientId}) -> [proceedExitToEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = self.appMirror.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            self.appMirror.proceedExitToEvent(event);
        });

        this.clientSocket.on("exitToPreviousState", () => {
            Logger.debug(`(${self.clientId}) -> [exitToPreviousState]`);
            self.appMirror.exitToPreviousState();
        });
    }

    private unlinkCurrentSocket() {
        this.clientSocket.removeAllListeners("disconnect");
        this.clientSocket.removeAllListeners("toState");
        this.clientSocket.removeAllListeners("proceedEvent");
        this.clientSocket.removeAllListeners("exitToState");
        this.clientSocket.removeAllListeners("proceedExitToEvent");
        this.clientSocket.removeAllListeners("exitToPreviousState");
    }

    private onReconnected():void {
        // TODO: Восстанавливать состояние клиента
    }
}
