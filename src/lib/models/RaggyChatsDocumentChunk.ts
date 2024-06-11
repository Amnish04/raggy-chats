import { nanoid } from "nanoid";
import db, { RaggyChatsDocumentChunkTable } from "../db";
import { RaggyChatsDocument } from "./RaggyChatsDocument";
import { Heap } from "heap-js";

interface VectorSearchRankedResult {
    id: string;
    documentId: string;
    content: string;
    similarity: number;
}

export type VectorEmbeddings = VectorEmbedding[];

export class VectorEmbedding {
    embedding: number[];

    constructor(embedding: number[]) {
        this.embedding = embedding;
    }

    get magnitude(): number {
        return Math.sqrt(this.embedding.reduce((sum, value) => sum + value * value, 0));
    }

    dotProduct(otherVector: VectorEmbedding): number {
        return this.embedding.reduce(
            (sum, value, index) => sum + value * otherVector.embedding[index],
            0
        );
    }

    cosineSimilarity(otherVector: VectorEmbedding): number {
        const dotProduct = this.dotProduct(otherVector);
        const magnitudeProduct = this.magnitude * otherVector.magnitude;
        return magnitudeProduct === 0 ? 0 : dotProduct / magnitudeProduct;
    }

    static async vectorSearch(
        queryEmbedding: number[],
        topN: number
    ): Promise<VectorSearchRankedResult[]> {
        const queryVector = new VectorEmbedding(queryEmbedding);

        // Retrieve document chunks relevant for RAG
        const documentChunks = await RaggyChatsDocumentChunk.getChunksForRag();

        // Configure as a max heap
        const heap = new Heap<VectorSearchRankedResult>((a, b) => b.similarity - a.similarity);

        for (const chunk of documentChunks) {
            const chunkVector = new VectorEmbedding(chunk.vector.embedding);
            const similarity = queryVector.cosineSimilarity(chunkVector);

            heap.push({
                id: chunk.id,
                documentId: chunk.documentId,
                content: chunk.content,
                similarity: similarity,
            });
        }

        // Most similar chunks would be
        // most valuable nodes in the heap

        const results: VectorSearchRankedResult[] = [];

        for (let i = 0; i < topN && !heap.isEmpty(); ++i) {
            results.push(heap.pop()!);
        }

        return results;
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

    static async getChunksForDocuments(documentIds: string[]): Promise<RaggyChatsDocumentChunk[]> {
        return (await db.documentChunks.where("documentId").anyOf(documentIds).toArray()).map(
            (docChunk) => RaggyChatsDocumentChunk.fromDB(docChunk)
        );
    }

    static async getChunksForRag() {
        const documentIdsToBeProcessed = (await RaggyChatsDocument.getDocumentsForRAG()).map(
            (doc) => doc.id
        );

        return await RaggyChatsDocumentChunk.getChunksForDocuments(documentIdsToBeProcessed);
    }

    static async remove(id: string) {
        return db.documentChunks.delete(id);
    }
}
