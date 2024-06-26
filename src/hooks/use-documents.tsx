import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import db from "../lib/db";
import { RaggyChatsDocument } from "../lib/models/RaggyChatsDocument";
import { RaggyChatsDocumentChunk } from "../lib/models/RaggyChatsDocumentChunk";

const asyncNoop = async () => {};

type DocumentsContextType = {
    documents: RaggyChatsDocument[];
    toggleUseForRAG: (documentId: string) => Promise<void>;
    deleteDocument: (documentId: string) => Promise<void>;
    addDocument: (
        document: RaggyChatsDocument,
        documentChunks: RaggyChatsDocumentChunk[]
    ) => Promise<void>;
};

const DocumentsContext = createContext<DocumentsContextType>({
    documents: [],
    addDocument: asyncNoop,
    deleteDocument: asyncNoop,
    toggleUseForRAG: asyncNoop,
});

export const DocumentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [documents, setDocuments] = useState<RaggyChatsDocument[]>([]);
    const [refresh, setRefresh] = useState(false);

    const fetchDocuments = useCallback(async () => {
        const allDocs = await db.documents.toArray();
        const raggyDocs = allDocs.map((doc) => RaggyChatsDocument.fromDB(doc));
        setDocuments(raggyDocs);
    }, []);

    const toggleUseForRAG = useCallback(async (documentId: string) => {
        const doc = await db.documents.get(documentId);
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

    const value = {
        documents,
        toggleUseForRAG,
        addDocument,
        deleteDocument,
    };

    return <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>;
};

const useDocuments = () => useContext(DocumentsContext);

export default useDocuments;
