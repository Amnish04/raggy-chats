import { nanoid } from "nanoid";
import db, { RaggyChatsMessageTable } from "../db";

export type MessageType = "user" | "assistant" | "system";

export type RaggyChatsMessages = RaggyChatsMessage[];

export class RaggyChatsMessage {
    id: string;
    date: Date;
    type: MessageType;
    model?: string;
    text: string;

    constructor({
        id,
        date,
        type,
        model,
        text,
    }: {
        id?: string;
        date?: Date;
        type: MessageType;
        model?: string;
        text: string;
    }) {
        this.id = id ?? nanoid();
        this.date = date ? new Date(date) : new Date(Date.now());
        this.type = type;
        this.model = model;
        this.text = text;
    }

    static fromDB(message: RaggyChatsMessageTable): RaggyChatsMessage {
        return new RaggyChatsMessage(message);
    }

    toDB(): RaggyChatsMessageTable {
        return {
            id: this.id,
            date: this.date,
            text: this.text,
            type: this.type,
            model: this.model,
        };
    }

    async save() {
        return db.messages.put(this.toDB());
    }

    static async remove(id: string) {
        return db.messages.delete(id);
    }

    async remove() {
        return db.messages.delete(this.id);
    }

    static async getAll() {
        return (await db.messages.orderBy("date").toArray()).map((message) =>
            RaggyChatsMessage.fromDB(message)
        );
    }

    static async add(message: RaggyChatsMessage) {
        return await db.messages.add(message.toDB());
    }
}
