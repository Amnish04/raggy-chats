import Dexie, { Table } from "dexie";
import { MessageType } from "./models/RaggyChatsMessage";

// export type RaggyChatsChatTable = {
//   id: string;
//   date: Date;
//   summary?: string;
//   messageIds: string[];
// };

export type RaggyChatsMessageTable = {
    id: string;
    date: Date;
    type: MessageType;
    model?: string;
    text: string;
};

export type RaggyChatsDocumentTable = {
    id: string;
    fileName: string;
    type: string;
    useForRAG: 0 | 1;
    dateAdded: Date;
};

export type RaggyChatsDocumentChunkTable = {
    id: string;
    documentId: string;
    documentName: string;
    content: string;
    embedding: number[];
};

class RaggyChatsDatabase extends Dexie {
    //   chats: Table<RaggyChatsChatTable, string>;
    messages: Table<RaggyChatsMessageTable, string>;
    documents: Table<RaggyChatsDocumentTable, string>;
    documentChunks: Table<RaggyChatsDocumentChunkTable, string>;

    constructor() {
        super("RaggyChatsDatabase");

        // Initial Version
        this.version(1).stores({
            //   chats: "id, date, summary, messageIds",
            messages: "id, date, type, model, text",
            documents: "id, fileName, type, dateAdded, useForRAG",
            documentChunks: "id, documentId",
        });

        // this.chats = this.table("chats");
        this.messages = this.table("messages");
        this.documents = this.table("documents");
        this.documentChunks = this.table("documentChunks");
    }
}

const db = new RaggyChatsDatabase();

export default db;
