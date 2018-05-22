export interface IDeserializer {
    /** Десериализует объект из JSON'a */
    fromJSON(json: any): any;
}
