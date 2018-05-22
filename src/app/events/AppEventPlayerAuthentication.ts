import {AppEvent} from "../AppEvent";
import {IPlayer} from "../IPlayer";
import {Slot} from "../Slot";

export class AppEventPlayerAuthentication extends AppEvent {
    public player:IPlayer;

    constructor(player:IPlayer) {
        super(Slot.PlayerAuthentication);
        this.player = player;
    }
}
