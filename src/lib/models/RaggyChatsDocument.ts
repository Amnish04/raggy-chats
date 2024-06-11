import { nanoid } from "nanoid";
import db, { RaggyChatsDocumentTable } from "../db";

export class RaggyChatsDocument {
    id: string;
    fileName: string;
    type: string;
    useForRAG: boolean;
    dateAdded: Date;

    constructor({
        id,
        fileName,
        type,
        useForRAG = true,
        dateAdded = new Date(Date.now()),
    }: {
        id?: string;
        fileName: string;
        type: string;
        useForRAG?: boolean;
        dateAdded?: Date;
    }) {
        this.id = id ?? nanoid();
        this.fileName = fileName;
        this.type = type;
        this.useForRAG = useForRAG;
        this.dateAdded = dateAdded;
    }

    private static supportedDocumentTypes: string[] = ["text/plain", "text/markdown", "text/html"];

    static isSupportedType(type: string) {
        return this.supportedDocumentTypes.includes(type);
    }

    static fromDB(document: RaggyChatsDocumentTable): RaggyChatsDocument {
        return new RaggyChatsDocument({
            id: document.id,
            fileName: document.fileName,
            type: document.type,
            useForRAG: document.useForRAG,
            dateAdded: document.dateAdded,
        });
    }

    toDB(): RaggyChatsDocumentTable {
        return {
            id: this.id,
            fileName: this.fileName,
            type: this.type,
            useForRAG: this.useForRAG,
            dateAdded: this.dateAdded,
        };
    }

    async save() {
        return db.documents.add(this.toDB());
    }

    /**
     * Adds the document to semantic search context when quering LLM
     */
    toggleUseForRAG() {
        this.useForRAG = !this.useForRAG;
    }
}
