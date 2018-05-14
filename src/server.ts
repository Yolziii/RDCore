import {ServerTransport} from "./server/ServerTransport";
import {ClientsRepository} from "./server/ClientsRepository";

const repository = new ClientsRepository();

const serverTransport = new ServerTransport(80, repository);
serverTransport.listen();
