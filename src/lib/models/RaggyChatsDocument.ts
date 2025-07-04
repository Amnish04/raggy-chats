import { nanoid } from "nanoid";
import db, { RaggyChatsDocumentTable } from "../db";
import { FaFilePdf, FaFileWord, FaMarkdown } from "react-icons/fa6";
import { IconType } from "react-icons";
import { BsFiletypePptx, BsFiletypeTxt } from "react-icons/bs";
import { TbFileSpreadsheet } from "react-icons/tb";
import { PiFileHtml } from "react-icons/pi";

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

    private static supportedDocumentTypes: string[] = [
        "text/plain",
        "text/markdown",
        "text/html",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.oasis.opendocument.text", // .odt
        "application/vnd.oasis.opendocument.presentation", // .odp
        "application/vnd.oasis.opendocument.spreadsheet", // .ods
        "application/pdf", // .pdf
    ];

    static isSupportedType(type: string) {
        return this.supportedDocumentTypes.includes(type);
    }

    static upcomingSupportedTypes(): string[] {
        return [];
    }

    static fromDB(document: RaggyChatsDocumentTable): RaggyChatsDocument {
        return new RaggyChatsDocument({
            id: document.id,
            fileName: document.fileName,
            type: document.type,
            useForRAG: !!document.useForRAG,
            dateAdded: document.dateAdded,
        });
    }

    toDB(): RaggyChatsDocumentTable {
        return {
            id: this.id,
            fileName: this.fileName,
            type: this.type,
            useForRAG: this.useForRAG ? 1 : 0,
            dateAdded: this.dateAdded,
        };
    }

    async save() {
        return db.documents.add(this.toDB());
    }

    static async remove(documentId: string) {
        await db.documents.delete(documentId);

        await db.documentChunks.bulkDelete(
            (await db.documentChunks.where("documentId").equals(documentId).toArray()).map(
                (document) => document.id
            )
        );
    }

    static async getDocumentsForRAG(): Promise<RaggyChatsDocument[]> {
        const ragEnabledDocuments = await db.documents.where("useForRAG").equals(1).toArray();

        return ragEnabledDocuments.map((doc) => RaggyChatsDocument.fromDB(doc));
    }

    /**
     * Adds the document to semantic search context when quering LLM
     */
    toggleUseForRAG() {
        this.useForRAG = !this.useForRAG;
    }

    private static iconsByType: { [key: string]: string | IconType } = {
        "text/plain": BsFiletypeTxt,
        "text/html": PiFileHtml,
        "text/markdown": FaMarkdown,
        "application/pdf": FaFilePdf,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FaFileWord, // .docx
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": BsFiletypePptx,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": TbFileSpreadsheet, // .xlsx
        "application/vnd.oasis.opendocument.text": BsFiletypeTxt, // .odt
        "application/vnd.oasis.opendocument.presentation": BsFiletypePptx, // .odp
        "application/vnd.oasis.opendocument.spreadsheet": TbFileSpreadsheet, // .ods
    };

    get icon(): string | IconType {
        return RaggyChatsDocument.iconsByType[this.type];
    }
}
