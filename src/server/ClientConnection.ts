import * as SocketIO from "socket.io";
import {Application, IAppEvent, IAppState, IRemoteApplication} from "../app/Application";
import {Protocol} from "../app/Protocol";

const log = console.log;

export class ClientConnection implements IRemoteApplication {
    private clientSocket:SocketIO.Socket;
    private clientNumber:number;
    private appMirror:Application;

    constructor(socket:SocketIO.Socket, clientNumber:number, client:Application) {
        this.clientSocket = socket;
        this.clientNumber = clientNumber;
        this.appMirror = client;

        log("Connected client #%s.", clientNumber);

        this.clientSocket.on("disconnect", this.onDisconnected);

        this.clientSocket.on("toState", (slot) => {
            (console).log(`-> [toState] ${slot}`);
            this.appMirror.toState(slot);
        });

        this.clientSocket.on("proceedEvent", (eventSJON) => {
            (console).log(`-> [proceedEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = this.appMirror.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.appMirror.proceedEvent(event);
        });

        this.clientSocket.on("exitToState", (slot) => {
            (console).log(`-> [exitToState] ${slot}`);

            this.appMirror.exitToState(slot);
        });

        this.clientSocket.on("proceedExitToEvent", (eventSJON) => {
            (console).log(`-> [proceedExitToEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = this.appMirror.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.appMirror.proceedExitToEvent(event);
        });

        this.clientSocket.on("exitToPreviousState", () => {
            (console).log(`-> [exitToPreviousState]`);
            this.appMirror.exitToPreviousState();
        });
    }

    public toState(slot:Protocol) {
        (console).log(`[toState] ${slot} ->`);
        this.clientSocket.emit("toState", slot);
    }

    public proceedEvent(event:IAppEvent) {
        const json = event.toJSON();

        (console).log(`[proceedEvent] ${JSON.stringify(json)} ->`);
        this.clientSocket.emit("proceedEvent", json);
    }

    public exitToState(slot:Protocol) {
        (console).log(`[exitToState] ${slot} ->`);
        this.clientSocket.emit("exitToState", slot);
    }

    public proceedExitToEvent(event:IAppEvent) {
        const json = event.toJSON();

        (console).log(`[proceedExitToEvent] ${JSON.stringify(json)} ->`);
        this.clientSocket.emit("proceedExitToEvent", json);
    }

    public exitToPreviousState() {
        (console).log(`[exitToPreviousState] -> `);
        this.clientSocket.emit("exitToPreviousState");
    }

    public get id():number {
        return this.clientNumber;
    }

    private onReconnected():void {
        // TODO: Восстанавливать состояние клиента
    }

    private onDisconnected():void {
        log("Client #%s disconnected", this.clientNumber);
    }
}
