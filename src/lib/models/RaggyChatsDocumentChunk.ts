import { nanoid } from "nanoid";
import db, { RaggyChatsDocumentChunkTable } from "../db";

export type VectorEmbeddings = VectorEmbedding[];

export class VectorEmbedding {
    embedding: number[];

    constructor(embedding: number[]) {
        this.embedding = embedding;
    }

    get magnitude(): number {
        // TODO
        return 0;
    }

    dotProduct(otherVector: VectorEmbedding): number {
        // TODO
        console.log(otherVector);
        return 0;
    }
}

export class RaggyChatsDocumentChunk {
    id: string;
    documentId: string;
    content: string;
    vector: VectorEmbedding;

    constructor({
        id,
        documentId,
        content,
        embedding,
    }: {
        id?: string;
        documentId: string;
        content: string;
        embedding: number[];
    }) {
        this.id = id ?? nanoid();
        this.documentId = documentId;
        this.content = content;
        this.vector = new VectorEmbedding(embedding);
    }

    static fromDB(documentChunk: RaggyChatsDocumentChunkTable): RaggyChatsDocumentChunk {
        return new RaggyChatsDocumentChunk({
            id: documentChunk.id,
            documentId: documentChunk.documentId,
            content: documentChunk.content,
            embedding: documentChunk.embedding,
        });
    }

    toDB(): RaggyChatsDocumentChunkTable {
        return {
            id: this.id,
            content: this.content,
            documentId: this.documentId,
            embedding: this.vector.embedding,
        };
    }

    async save() {
        return db.documentChunks.add(this.toDB());
    }

    static async remove(id: string) {
        return db.documentChunks.delete(id);
    }
}
