export const enum RDErrorCode {
    UNDEFINED = "UNDEFINED",

    DICE_INDEX_EMPTY = "DICE_INDEX_EMPTY",
    DICE_IF_FULL = "DICE_IF_FULL",
    DICE_INDEX_FULL = "DICE_INDEX_FULL",
    DICE_NOT_FULL = "DICE_NOT_FULL",
}

export class RDError {
    private errCode: RDErrorCode;
    private errMessage: string;

    constructor(code: RDErrorCode, message: string = "") {
        this.errCode = code;
        this.errMessage = message;
    }

    get code() {
        return this.errCode;
    }

    get message() {
        return this.errMessage;
    }
}