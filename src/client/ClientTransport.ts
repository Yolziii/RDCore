import * as SocketIO from "socket.io-client";
import {IAppEvent, IApplication, IAppState, IRemoteApplication} from "../app/Application";
import {Protocol} from "../app/Protocol";

export class ClientTransport implements IRemoteApplication {
    private serverSocket: SocketIOClient.Socket;
    private serverUrl: string;
    private app:IApplication;

    constructor(serverUrl:string) {
        this.serverUrl = serverUrl;
    }

    public linkApplication(app:IApplication) {
        this.app = app;
    }

    public connect() {
        const log = console.log;

        this.serverSocket = SocketIO.connect(this.serverUrl, {reconnection: true});

        log("Connected to: %s", this.serverUrl);

        this.serverSocket.on("reconnect", () => {
            // TODO: Поведение при реконнекте
            log("Client reconnect!");
        });

        this.serverSocket.on("disconnect", () => {
            // TODO: Поведение при дисконнекте
            log("Disconnected from server");
        });

        this.serverSocket.on("toState", (slot) => {
            this.app.toState(slot);
        });

        this.serverSocket.on("proceedEvent", (eventSJON: any) => {
            const state:IAppState = this.app.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.app.proceedEvent(event);
        });

        this.serverSocket.on("exitToState", (slot) => {
            this.app.exitToState(slot);
        });

        this.serverSocket.on("proceedExitToEvent", (eventSJON: any) => {
            const state:IAppState = this.app.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.app.proceedExitToEvent(event);
        });

        this.serverSocket.on("exitToPreviousState", () => {
            this.app.exitToPreviousState();
        });
    }

    public toState(slot:Protocol) {
        this.serverSocket.emit("toState", slot);
    }

    public proceedEvent(event:IAppEvent) {
        this.serverSocket.emit("proceedEvent", event.toJSON());
    }

    public exitToState(slot:Protocol) {
        this.serverSocket.emit("exitToState", slot);
    }

    public proceedExitToEvent(event:IAppEvent) {
        this.serverSocket.emit("proceedExitToEvent", event.toJSON());
    }

    public exitToPreviousState() {
        this.serverSocket.emit("exitToPreviousState");
    }
}
