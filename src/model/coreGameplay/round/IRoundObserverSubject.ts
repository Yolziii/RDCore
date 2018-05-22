/** Отвечает за реализацию Наблюдателя для раунда */
import {IRoundObserver} from "./IRoundObserver";

export interface IRoundObserverSubject {
    addObserver(observer:IRoundObserver);
    removeObserver(observer:IRoundObserver);
}
