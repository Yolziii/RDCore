import * as SocketIO from "socket.io";
import {Application, IAppEvent, IAppState, IRemoteApplication} from "../app/Application";
import {Protocol} from "../app/Protocol";
import {Logger} from "../util/Logger";

export class ClientConnection implements IRemoteApplication {
    private clientSocket:SocketIO.Socket;
    private clientNumber:number;
    private appMirror:Application;

    constructor(socket:SocketIO.Socket, clientNumber:number, client:Application) {
        this.clientSocket = socket;
        this.clientNumber = clientNumber;
        this.appMirror = client;

        Logger.info("Connected client #%s.", clientNumber);

        this.clientSocket.on("disconnect", this.onDisconnected);

        this.clientSocket.on("toState", (slot) => {
            Logger.info(`-> [toState] ${slot}`);
            this.appMirror.toState(slot);
        });

        this.clientSocket.on("proceedEvent", (eventSJON) => {
            Logger.info(`-> [proceedEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = this.appMirror.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.appMirror.proceedEvent(event);
        });

        this.clientSocket.on("exitToState", (slot) => {
            Logger.info(`-> [exitToState] ${slot}`);

            this.appMirror.exitToState(slot);
        });

        this.clientSocket.on("proceedExitToEvent", (eventSJON) => {
            Logger.info(`-> [proceedExitToEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = this.appMirror.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.appMirror.proceedExitToEvent(event);
        });

        this.clientSocket.on("exitToPreviousState", () => {
            Logger.info(`-> [exitToPreviousState]`);
            this.appMirror.exitToPreviousState();
        });
    }

    public toState(slot:Protocol) {
        Logger.info(`[toState] ${slot} ->`);
        this.clientSocket.emit("toState", slot);
    }

    public proceedEvent(event:IAppEvent) {
        const json = event.toJSON();

        Logger.info(`[proceedEvent] ${JSON.stringify(json)} ->`);
        this.clientSocket.emit("proceedEvent", json);
    }

    public exitToState(slot:Protocol) {
        Logger.info(`[exitToState] ${slot} ->`);
        this.clientSocket.emit("exitToState", slot);
    }

    public proceedExitToEvent(event:IAppEvent) {
        const json = event.toJSON();

        Logger.info(`[proceedExitToEvent] ${JSON.stringify(json)} ->`);
        this.clientSocket.emit("proceedExitToEvent", json);
    }

    public exitToPreviousState() {
        Logger.info(`[exitToPreviousState] -> `);
        this.clientSocket.emit("exitToPreviousState");
    }

    public get id():number {
        return this.clientNumber;
    }

    private onReconnected():void {
        // TODO: Восстанавливать состояние клиента
    }

    private onDisconnected():void {
        Logger.warning("Client #%s disconnected", this.clientNumber);
    }
}
