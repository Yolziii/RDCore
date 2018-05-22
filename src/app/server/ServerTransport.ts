import { createServer, Server } from "http";
import * as express from "express";
import * as SocketIO from "socket.io";
import {ClientConnection} from "./ClientConnection";
import {ServerWaitState} from "./statesServer/ServerWaitState";
import {ServerStartSingleRound} from "./statesServer/round/ServerStartSingleRound";
import {Logger} from "../../util/logger/Logger";
import {ServerEventPrototypes} from "./ServerEventPrototypes";
import {ServerPlayerAuthentification} from "./statesServer/ServerPlayerAuthentification";
import {ClientMirrorApplication} from "./ClientMirrorApplication";
import {Slot} from "../Slot";

export class ServerTransport {
    private eapp: express.Application;
    private server: Server;
    private socketIo: SocketIO.Server;
    private port: number;
    private connections:ClientConnection[] = [];

    constructor(port:number) {
        this.port = port;

        this.eapp = express();
        this.server = createServer(this.eapp);
        this.socketIo = SocketIO(this.server);
    }

    public listen() {
        this.server.listen(this.port, () => {
            Logger.info("Running server on port %s", this.port);
        });

        const self = this;
        this.socketIo.on("connect", (socket: SocketIO.Socket) => {
            const client:ClientMirrorApplication = new ClientMirrorApplication(ServerEventPrototypes);
            const connection = new ClientConnection(socket, client);

            client.fillSlot(new ServerPlayerAuthentification(connection));
            client.fillSlot(new ServerWaitState());
            client.fillSlot(new ServerStartSingleRound(connection));

            self.connections.push(connection);

            client.linkConnection(connection);
            client.toState(Slot.WaitForClient);

            // TODO: Хранить/восстанавливать сессии, реконнект с других девайсов, подключение к существующей игре
        });
    }
}
