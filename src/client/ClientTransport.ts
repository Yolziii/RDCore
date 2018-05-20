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

        this.serverSocket = SocketIO.connect(this.serverUrl, {reconnection: true, timeout: 15 * 60 * 1000});

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
            // (console).log(`-> [toState] ${slot}`);

            this.app.toState(slot);
        });

        this.serverSocket.on("proceedEvent", (eventSJON: any) => {
            // (console).log(`-> [proceedEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = this.app.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.app.proceedEvent(event);
        });

        this.serverSocket.on("exitToState", (slot) => {
            // (console).log(`-> [exitToState] ${slot}`);

            this.app.exitToState(slot);
        });

        this.serverSocket.on("proceedExitToEvent", (eventSJON: any) => {
            // (console).log(`-> [proceedExitToEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = this.app.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.app.proceedExitToEvent(event);
        });

        this.serverSocket.on("exitToPreviousState", () => {
            // (console).log(`-> [exitToPreviousState]`);

            this.app.exitToPreviousState();
        });
    }

    public toState(slot:Protocol) {
        // (console).log(`[toState] ${slot} ->`);

        this.serverSocket.emit("toState", slot);
    }

    public proceedEvent(event:IAppEvent) {
        const json = event.toJSON();
        // (console).log(`[proceedEvent] ${JSON.stringify(json)} ->`);

        this.serverSocket.emit("proceedEvent", json);
    }

    public exitToState(slot:Protocol) {
        // (console).log(`[exitToState] ${slot} ->`);

        this.serverSocket.emit("exitToState", slot);
    }

    public proceedExitToEvent(event:IAppEvent) {
        const json = event.toJSON();

        // (console).log(`[proceedExitToEvent] ${JSON.stringify(json)} ->`);

        this.serverSocket.emit("proceedExitToEvent", json);
    }

    public exitToPreviousState() {
        // (console).log(`[exitToPreviousState] -> `);

        this.serverSocket.emit("exitToPreviousState");
    }
}
