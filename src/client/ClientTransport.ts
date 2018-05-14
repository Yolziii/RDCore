import * as SocketIO from "socket.io-client";

export class ClientTransport {
    private socket: SocketIOClient.Socket;
    private serverUrl: string;

    constructor(serverUrl:string) {
        this.serverUrl = serverUrl;
    }

    public connect() {
        const log = console.log;

        this.socket = SocketIO.connect(this.serverUrl, {reconnection: true});

        log("Connected to: %s", this.serverUrl);

        this.socket.on("message", (m: any) => {
            log("[client](message): %s", JSON.stringify(m));
            // his.io.emit("message", m);
        });

        this.socket.on("reconnect", () => {
            log("Client reconnect!");
        });

        this.socket.on("disconnect", () => {
            log("Disconnected from server");
        });
    }
}
