import {AppEvent} from "../AppEvent";
import {IPlayer} from "../IPlayer";
import {StateSlot} from "../StateSlot";

export class AppEventPlayerAuthentication extends AppEvent {
    public player:IPlayer;

    constructor(player:IPlayer) {
        super(StateSlot.PlayerAuthentication);
        this.player = player;
    }
}
