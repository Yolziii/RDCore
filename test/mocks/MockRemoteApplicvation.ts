import {IRemoteApplication} from "../../src/app/IRemoteApplication";
import {Slot} from "../../src/app/Slot";
import {IAppEvent} from "../../src/app/IAppEvent";

export class MockRemoteApplicvation implements IRemoteApplication {
    public toState(slot:Slot) {/**/}

    public proceedEvent(event:IAppEvent) {/**/}

    public exitToState(slot:Slot) {/**/}

    public proceedExitToEvent(event:IAppEvent) {/**/}

    public exitToPreviousState() {/**/}
}
