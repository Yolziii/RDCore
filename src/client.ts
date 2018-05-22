import {MainScreenState} from "./client/statesClient/MainScreenState";
import {TerminalViewFactory} from "./client/terminalView/TerminalViewFactory";
import {StartRoundState} from "./client/statesClient/round/StartRoundState";
import {ClientTransport} from "./client/ClientTransport";
import {ClientEventPrototypes} from "./client/ClientEventPrototypes";
import {Logger} from "./util/logger/Logger";
import {ClientPlayerAuthenticationState} from "./client/statesClient/ClientPlayerAuthenticationState";
import {IPlayer} from "./app/IPlayer";
import {ClientApplication} from "./client/ClientApplication";
import {Slot} from "./app/Slot";
import {StreamLogger} from "./util/logger/StreamLogger";

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

let user:IPlayer = {
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

app.fillSlot(new ClientPlayerAuthenticationState(user, remoteServer));
app.fillSlot(new MainScreenState());
app.fillSlot(new StartRoundState(remoteServer));

app.toState(Slot.PlayerAuthentication);

(function wait() {
    setTimeout(wait, 1000);
})();
