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
import { useAlert } from "../hooks/use-alert";

export default function PromptForm() {
    const { error, progress, closeToast, info } = useAlert();

    const handleFileUpload = useCallback(
        async (selectedFiles: FileList) => {
            const selectedFile = selectedFiles[0];

            try {
                const textContent = await selectedFile.text();
                const chunks = getSentenceChunksFrom(textContent, 500);

                const chunksToBeProcessed = chunks.length;
                let chunksProcessed = 0;
                let progressPercentage = chunksProcessed / chunksToBeProcessed;

                const progressToastId = progress({
                    title: "Uploading Document",
                    message: "Generating vector embeddings...",
                    progressPercentage,
                });

                // Create Models (Document and Chunks)
                const document = new RaggyChatsDocument({
                    fileName: selectedFile.name,
                    type: selectedFile.type,
                });

                const documentChunks: RaggyChatsDocumentChunk[] = [];

                // These vector embedding requests could be concurrent,
                // but would be an overkill since the vectore generation
                // is already super fast
                chunks.forEach(async (chunk, index) => {
                    documentChunks[index] = new RaggyChatsDocumentChunk({
                        content: chunk,
                        embedding: (await getVectorEmbeddings(chunk)).data[0].embedding,
                        documentId: document.id,
                    });

                    ++chunksProcessed;
                    progressPercentage = Math.floor(chunksProcessed / chunksToBeProcessed);

                    progress({
                        id: progressToastId,
                        title: "Uploading Document",
                        message: "Generating vector embeddings...",
                        progressPercentage,
                        updateOnly: true,
                    });
                });

                progress({
                    id: progressToastId,
                    title: "Uploading Document",
                    message: "Saving document info in indexedDB...",
                    progressPercentage,
                    updateOnly: true,
                });

                await document.save();

                progress({
                    id: progressToastId,
                    title: "Uploading Document",
                    message: "Saving chunks and embeddings in indexedDB...",
                    progressPercentage,
                    updateOnly: true,
                });

                documentChunks.forEach(async (docChunk) => {
                    await docChunk.save();
                });

                progress({
                    id: progressToastId,
                    title: "Uploading Document",
                    message: "Saving chunks and embeddings in indexedDB...",
                    progressPercentage: 100,
                    updateOnly: true,
                });

                closeToast(progressToastId);

                info({
                    title: "Document successfully saved",
                    message: "It can now be used to augment your queries to LLM",
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.log(err);
                error({
                    title: "Document upload failed",
                    message: err.message,
                });
            }
        },
        [closeToast, error, info, progress]
    );

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
