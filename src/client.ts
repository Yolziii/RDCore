import {ClientApplication} from "./app/Application";
import {Slot} from "./app/Protocol";
import {MainScreenState} from "./app/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./client/terminalView/TerminalViewFactory";
import {StartRoundState} from "./app/round/StartRoundState";
import {ClientTransport} from "./client/ClientTransport";
import {ClientEventPrototypes} from "./client/ClientEventPrototypes";
import {StreamLogger, Logger} from "./util/Logger";
import {ClientPlayerAuthentication} from "./app/mainScreen/ServerPlayerAuthentification";

// tslint:disable:no-var-requires
const commander = require("commander");
const fs = require("fs");

// -------------------------------------------------------
// To read this file use this in PowerShell:
// Get-Content client.logStateMethod -Wait -Tail 30

const logStream = fs.createWriteStream("./client.log");
logStream.once("open", (fd) => {/**/});

const fileLogger = new StreamLogger(logStream);
// fileLogger.setLevel(LogLevel.Error | LogLevel.Warning | LogLevel.Info);
Logger.add(fileLogger);

// -------------------------------------------------------
commander
    .version("0.0.1", "-v, --version")
    .option("-u, --user [string]", "JSON file with user params")
    .parse(process.argv);

let user = {
    name: "Default User"
};

if (commander.user) {
    user = require(commander.user);
}

Logger.info(JSON.stringify(user));

// -------------------------------------------------------

const remoteServer = new ClientTransport("http://127.0.0.1");
remoteServer.connect();

const viewFactory = new TerminalViewFactory();
const app:ClientApplication = new ClientApplication(ClientEventPrototypes, viewFactory, remoteServer);

remoteServer.linkApplication(app);

app.fillSlot(new ClientPlayerAuthentication(user, remoteServer));
app.fillSlot(new MainScreenState());
app.fillSlot(new StartRoundState(remoteServer));

app.toState(Slot.PlayerAuthentication);

(function wait() {
    if (true) {
        setTimeout(wait, 1000);
    }
})();
