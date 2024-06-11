import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Tooltip,
} from "@chakra-ui/react";

import { useCallback } from "react";
import { IoMdSend } from "react-icons/io";
import { getVectorEmbeddings } from "../lib/ai";
import { RaggyChatsDocument } from "../lib/models/RaggyChatsDocument";
import { RaggyChatsDocumentChunk } from "../lib/models/RaggyChatsDocumentChunk";
import { getSentenceChunksFrom } from "../lib/utils";
import FileInputButton from "./FileInputButton";

export default function PromptForm() {
    const handleFileUpload = useCallback(async (selectedFiles: FileList) => {
        const selectedFile = selectedFiles[0];

        try {
            const textContent = await selectedFile.text();
            const chunks = getSentenceChunksFrom(textContent, 500);

            // Create Models (Document and Chunks)
            const document = new RaggyChatsDocument({
                fileName: selectedFile.name,
                type: selectedFile.type,
            });

            const documentChunks: RaggyChatsDocumentChunk[] = [];

            chunks.forEach(async (chunk, index) => {
                documentChunks[index] = new RaggyChatsDocumentChunk({
                    content: chunk,
                    embedding: (await getVectorEmbeddings(chunk)).data[0].embedding,
                    documentId: document.id,
                });
            });

            await document.save();
            documentChunks.forEach(async (docChunk) => {
                await docChunk.save();
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <InputGroup>
            <InputLeftElement>
                <FileInputButton
                    iconButtonProps={{
                        borderRightRadius: "none",
                        "aria-label": "Upload files for RAG",
                    }}
                    onFilesSelected={handleFileUpload}
                />
            </InputLeftElement>

            <Input
                focusBorderColor="purple.500"
                aria-label="Enter your query"
                placeholder={"Enter your query"}
            />

            <InputRightElement>
                <Tooltip label={"Send Message"}>
                    <IconButton
                        aria-label="Send Message"
                        variant={"outline"}
                        border={"none"}
                        borderLeftRadius={"none"}
                        icon={<IoMdSend />}
                    />
                </Tooltip>
            </InputRightElement>
        </InputGroup>
    );
}
