/** Вид событий, о которых игровой раунд оповещает своих слушателей */
export enum RoundEventType {
    Throw,
    Hold,
    Free,
    FillCell,
    SelectCard,
    SelectPlayer,
    End
}
