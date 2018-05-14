import {IDictionary} from "../util/Dictionaries";
import {Application} from "../application/Application";
import {ClientConnection} from "./ClientConnection";

export class ClientsRepository {
    private lastClientNumber:number = 0;
    private clients:IDictionary<Application> = {};
    private connections:ClientConnection[] = [];

    public createClient():number {
        this.lastClientNumber++;

        const clientApp:Application = new Application();
        this.clients[this.lastClientNumber] = clientApp;

        return this.lastClientNumber;
    }

    public hasClient(clientNumber:number):boolean {
        return clientNumber in this.clients;
    }

    public getClient(clientNumber:number):Application {
        return this.clients[clientNumber];
    }
}
