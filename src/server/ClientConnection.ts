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
            this.appMirror.toState(slot);
        });

        this.clientSocket.on("proceedEvent", (eventSJON: any) => {
            const state:IAppState = this.appMirror.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.appMirror.proceedEvent(event);
        });

        this.clientSocket.on("exitToState", (slot) => {
            this.appMirror.exitToState(slot);
        });

        this.clientSocket.on("proceedExitToEvent", (eventSJON: any) => {
            const state:IAppState = this.appMirror.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.appMirror.proceedExitToEvent(event);
        });

        this.clientSocket.on("exitToPreviousState", () => {
            this.appMirror.exitToPreviousState();
        });
    }

    public toState(slot:Protocol) {
        this.clientSocket.emit("toState", slot);
    }

    public proceedEvent(event:IAppEvent) {
        this.clientSocket.emit("proceedEvent", event.toJSON());
    }

    public exitToState(slot:Protocol) {
        this.clientSocket.emit("exitToState", slot);
    }

    public proceedExitToEvent(event:IAppEvent) {
        this.clientSocket.emit("proceedExitToEvent", event.toJSON());
    }

    public exitToPreviousState() {
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
