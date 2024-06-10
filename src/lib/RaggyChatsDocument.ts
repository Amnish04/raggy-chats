import { RaggyChatsDocumentTable } from "./db";

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
        id: string;
        fileName: string;
        type: string;
        useForRAG: boolean;
        dateAdded: Date;
    }) {
        this.id = id;
        this.fileName = fileName;
        this.type = type;
        this.useForRAG = useForRAG;
        this.dateAdded = dateAdded;
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

    toDB(chunkIds: string[]): RaggyChatsDocumentTable {
        return {
            id: this.id,
            fileName: this.fileName,
            type: this.type,
            useForRAG: this.useForRAG,
            dateAdded: this.dateAdded,
            chunkIds,
        };
    }

    /**
     * Adds the document to semantic search context when quering LLM
     */
    toggleUseForRAG() {
        this.useForRAG = !this.useForRAG;
    }
}
