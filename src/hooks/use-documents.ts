import { useCallback, useEffect, useState } from "react";
import db from "../lib/db";
import { RaggyChatsDocument } from "../lib/models/RaggyChatsDocument";
import { RaggyChatsDocumentChunk } from "../lib/models/RaggyChatsDocumentChunk";

const useDocuments = () => {
    const [documents, setDocuments] = useState<RaggyChatsDocument[]>([]);
    const [refresh, setRefresh] = useState(false);

    const fetchDocuments = useCallback(async () => {
        const allDocs = await db.documents.toArray();
        const raggyDocs = allDocs.map((doc) => RaggyChatsDocument.fromDB(doc));
        setDocuments(raggyDocs);
    }, []);

    const toggleUseForRAG = useCallback(async (docId: string) => {
        const doc = await db.documents.get(docId);
        if (doc) {
            const updatedDoc = RaggyChatsDocument.fromDB(doc);
            updatedDoc.toggleUseForRAG();
            await db.documents.put(updatedDoc.toDB());
            setRefresh((prev) => !prev); // Trigger refresh
        }
    }, []);

    const addDocument = useCallback(
        async (document: RaggyChatsDocument, documentChunks: RaggyChatsDocumentChunk[]) => {
            await document.save();

            for (const docChunk of documentChunks) {
                await docChunk.save();
            }

            setRefresh((prev) => !prev); // Trigger refresh
        },
        []
    );

    const deleteDocument = useCallback(async (documentId: string) => {
        await RaggyChatsDocument.remove(documentId);

        setRefresh((prev) => !prev); // Trigger refresh
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments, refresh]);

    return {
        documents,
        toggleUseForRAG,
        addDocument,
        deleteDocument,
    };
};

export default useDocuments;
