import { createServer, Server } from "http";
import * as express from "express";
import * as SocketIO from "socket.io";
import {ClientsRepository} from "./ClientsRepository";
import {ClientConnection} from "./ClientConnection";
import {Application} from "../application/Application";
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
            const client:Application = self.clients.getClient(clientNumber);
            const connection = new ClientConnection(socket, clientNumber, client);
            self.connections.push(connection);

            // TODO: Хранить/восстанавливать сессии, реконнект с других девайсов, подключение к существующей игре
        });
    }
}