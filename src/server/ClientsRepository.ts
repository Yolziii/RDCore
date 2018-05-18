import {IDictionary} from "../util/Dictionaries";
import {Application, ClientMirrorApplication} from "../app/Application";
import {ClientConnection} from "./ClientConnection";
import {Protocol} from "../app/Protocol";
import {ServerWaitState} from "../app/mainScreen/ServerWaitState";
import {ServerStartSingleRound} from "../app/round/remote/ServerStartSingleRound";
import {ServerEventPrototypes} from "./ServerEventPrototypes";

export class ClientsRepository {
    private lastClientNumber:number = 0;
    private clients:IDictionary<ClientMirrorApplication> = {};
    private connections:ClientConnection[] = [];

    public createClient():number {
        this.lastClientNumber++;

        const clientMirrorApp:ClientMirrorApplication = new ClientMirrorApplication(ServerEventPrototypes);

        this.clients[this.lastClientNumber] = clientMirrorApp;

        return this.lastClientNumber;
    }

    public hasClient(clientNumber:number):boolean {
        return clientNumber in this.clients;
    }

    public getClient(clientNumber:number):ClientMirrorApplication {
        return this.clients[clientNumber];
    }
}
