import {IAppEvent, IRemoteApplication} from "../../src/app/Application";
import {Protocol} from "../../src/app/Protocol";

export class MockRemoteApplicvation implements IRemoteApplication {
    public toState(slot:Protocol) {/**/}

    public proceedEvent(event:IAppEvent) {/**/}

    public exitToState(slot:Protocol) {/**/}

    public proceedExitToEvent(event:IAppEvent) {/**/}

    public exitToPreviousState() {/**/}
}
