import {IRoundPlayer} from "./IRoundPlayer";

/** Игровой раунд */
export interface IRound extends IRoundPlayer {
    /** Количество игроков */
    readonly totalPlayers:number;

    /** Для раунда возвращает общее количество очков, набранное игром */
    readonly score:number;

    /** Сделать текущим игрока с указанным индексом */
    selectPlayer(index:number);

    /** Возвращает текущего игрока */
    getPlayer():IRoundPlayer;
}
