import { createServer, Server } from "http";
import * as express from "express";
import * as SocketIO from "socket.io";
import {ClientsRepository} from "./ClientsRepository";
import {ClientConnection} from "./ClientConnection";
import {Application, ClientMirrorApplication, IApplication} from "../app/Application";
import {Protocol} from "../app/Protocol";
import {ServerWaitState} from "../app/mainScreen/ServerWaitState";
import {ServerStartSingleRound} from "../app/round/remote/ServerStartSingleRound";
const log = console.log;

export class ServerTransport {
    private eapp: express.Application;
    private server: Server;
    private socketIo: SocketIO.Server;
    private port: number;
    private clients:ClientsRepository;
    private connections:ClientConnection[] = [];

    constructor(port:number, clients:ClientsRepository) {
        this.port = port;
        this.clients = clients;

        this.eapp = express();
        this.server = createServer(this.eapp);
        this.socketIo = SocketIO(this.server);
    }

    public listen() {
        this.server.listen(this.port, () => {
            log("Running server on port %s", this.port);
        });

        const self = this;
        this.socketIo.on("connect", (socket: SocketIO.Socket) => {
            const clientNumber = self.clients.createClient();

            const client:ClientMirrorApplication = self.clients.getClient(clientNumber);
            const connection = new ClientConnection(socket, clientNumber, client);

            client.fillSlot(new ServerWaitState());
            client.fillSlot(new ServerStartSingleRound(connection));

            self.connections.push(connection);

            client.linkConnection(connection);
            client.toState(Protocol.WaitForClient);

            // TODO: Хранить/восстанавливать сессии, реконнект с других девайсов, подключение к существующей игре
        });
    }
}
