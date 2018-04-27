export const enum RDErrorCode {
    DICE_INDEX_EMPTY = "DICE_INDEX_EMPTY",
    DICE_IF_FULL = "DICE_IF_FULL",
    DICE_INDEX_FULL = "DICE_INDEX_FULL",
    DICE_NOT_FULL = "DICE_NOT_FULL",
}

export default class RDError {
    private _code:RDErrorCode;
    private _message:string;

    constructor(code:RDErrorCode, message:string) {
        this._code = code;
        this._message = message;
    }

    get code() {
        return this._code;
    }

    get message() {
        return this._message;
    }
}