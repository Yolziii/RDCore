import {IDictionary} from "../util/Dictionaries";
import {Application, ClientMirrorApplication} from "../app/Application";
import {ClientConnection} from "./ClientConnection";
import {Protocol} from "../app/Protocol";
import {ServerWaitState} from "../app/mainScreen/ServerWaitState";

export class ClientsRepository {
    private lastClientNumber:number = 0;
    private clients:IDictionary<ClientMirrorApplication> = {};
    private connections:ClientConnection[] = [];

    public createClient():number {
        this.lastClientNumber++;

        const clientApp:ClientMirrorApplication = new ClientMirrorApplication();

        clientApp.fillSlot(new ServerWaitState());

        this.clients[this.lastClientNumber] = clientApp;

        return this.lastClientNumber;
    }

    public hasClient(clientNumber:number):boolean {
        return clientNumber in this.clients;
    }

    public getClient(clientNumber:number):ClientMirrorApplication {
        return this.clients[clientNumber];
    }
}
