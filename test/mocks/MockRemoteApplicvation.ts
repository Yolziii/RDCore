import {IAppEvent, IRemoteApplication} from "../../src/app/Application";
import {Slot} from "../../src/app/Protocol";

export class MockRemoteApplicvation implements IRemoteApplication {
    public toState(slot:Slot) {/**/}

    public proceedEvent(event:IAppEvent) {/**/}

    public exitToState(slot:Slot) {/**/}

    public proceedExitToEvent(event:IAppEvent) {/**/}

    public exitToPreviousState() {/**/}
}
