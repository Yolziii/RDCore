import {RDErrorCode} from "./RDErrorCode";

export default class RDError {
    private errCode: RDErrorCode;
    private errMessage: string;

    constructor(code: RDErrorCode, message: string = "") {
        this.errCode = code;
        this.errMessage = `[${RDErrorCode[code]}]: ${message}`;
    }

    get code() {
        return this.errCode;
    }

    get message() {
        return this.errMessage;
    }
}
