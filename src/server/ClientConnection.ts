import * as SocketIO from "socket.io";
import {Application} from "../application/Application";

const log = console.log;

export class ClientConnection {
    private socket:SocketIO.Socket;
    private clientNumber:number;
    private client:Application;

    constructor(socket:SocketIO.Socket, clientNumber:number, client:Application) {
        this.socket = socket;
        this.clientNumber = clientNumber;
        this.client = client;

        log("Connected client #%s.", clientNumber);

        this.socket.on("message", (m: any) => {
            log("[client #%s message): %s", clientNumber, JSON.stringify(m));
            // this.io.emit("message", m);
        });

        this.socket.on("disconnect", () => {
            log("Client #%s disconnected", clientNumber);
        });
    }

    public sendMessage(data:any) {

    }

    private onMessage(m:any):void {

    }

    private onReconnected():void {

    }

    private onDisconnected():void {

    }
}
