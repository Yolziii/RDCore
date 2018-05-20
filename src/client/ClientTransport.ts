import * as SocketIO from "socket.io-client";
import {IAppEvent, IApplication, IAppState, IRemoteApplication} from "../app/Application";
import {Protocol} from "../app/Protocol";
import {Logger} from "../util/Logger";

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
        this.serverSocket = SocketIO.connect(this.serverUrl, {reconnection: true, timeout: 15 * 60 * 1000});

        Logger.info("Connected to: %s", this.serverUrl);

        this.serverSocket.on("reconnect", () => {
            // TODO: Поведение при реконнекте
            Logger.info("Client reconnect!");
        });

        this.serverSocket.on("disconnect", () => {
            // TODO: Поведение при дисконнекте
            Logger.error("Disconnected from server");
        });

        this.serverSocket.on("toState", (slot) => {
            Logger.info(`-> [toState] ${slot}`);

            this.app.toState(slot);
        });

        this.serverSocket.on("proceedEvent", (eventSJON: any) => {
            Logger.info(`-> [proceedEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = this.app.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.app.proceedEvent(event);
        });

        this.serverSocket.on("exitToState", (slot) => {
            Logger.info(`-> [exitToState] ${slot}`);

            this.app.exitToState(slot);
        });

        this.serverSocket.on("proceedExitToEvent", (eventSJON: any) => {
            Logger.info(`-> [proceedExitToEvent] ${JSON.stringify(eventSJON)}`);

            const state:IAppState = this.app.getState(eventSJON.slot);
            const event:IAppEvent = state.fromJSON(eventSJON);
            this.app.proceedExitToEvent(event);
        });

        this.serverSocket.on("exitToPreviousState", () => {
            Logger.info(`-> [exitToPreviousState]`);

            this.app.exitToPreviousState();
        });
    }

    public toState(slot:Protocol) {
        Logger.info(`[toState] ${slot} ->`);

        this.serverSocket.emit("toState", slot);
    }

    public proceedEvent(event:IAppEvent) {
        const json = event.toJSON();
        Logger.info(`[proceedEvent] ${JSON.stringify(json)} ->`);

        this.serverSocket.emit("proceedEvent", json);
    }

    public exitToState(slot:Protocol) {
        Logger.info(`[exitToState] ${slot} ->`);

        this.serverSocket.emit("exitToState", slot);
    }

    public proceedExitToEvent(event:IAppEvent) {
        const json = event.toJSON();

        Logger.info(`[proceedExitToEvent] ${JSON.stringify(json)} ->`);

        this.serverSocket.emit("proceedExitToEvent", json);
    }

    public exitToPreviousState() {
        Logger.info(`[exitToPreviousState] -> `);

        this.serverSocket.emit("exitToPreviousState");
    }
}
