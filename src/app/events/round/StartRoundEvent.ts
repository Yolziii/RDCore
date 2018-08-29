import {StateSlot} from "../../StateSlot";
import {RoundMode} from "../../client/controllers/round/RoundMode";
import {AppEvent} from "../../AppEvent";

export interface IStartRoundEventParams {
    mode:RoundMode;
    withJokers?:boolean;
}

export class StartRoundEvent extends AppEvent implements IStartRoundEventParams {
    public mode:RoundMode;
    public withJokers:boolean = false;

    constructor(params:IStartRoundEventParams) {
        super(StateSlot.StartRound);
        this.mode = params.mode;
        if (params.withJokers != null) {
            this.withJokers = params.withJokers;
        }
    }
}
