import {IRemoteApplication} from "../../src/app/IRemoteApplication";
import {StateSlot} from "../../src/app/StateSlot";
import {IAppEvent} from "../../src/app/IAppEvent";

export class MockRemoteApplicvation implements IRemoteApplication {
    public toState(slot:StateSlot) {/**/}

    public proceedEvent(event:IAppEvent) {/**/}

    public exitToState(slot:StateSlot) {/**/}

    public proceedExitToEvent(event:IAppEvent) {/**/}

    public exitToPreviousState() {/**/}
}
