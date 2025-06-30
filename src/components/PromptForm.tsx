import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Tooltip,
} from "@chakra-ui/react";

import { useCallback, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useAlert } from "../hooks/use-alert";
import { getVectorEmbeddings } from "../lib/ai";
import { RaggyChatsDocument } from "../lib/models/RaggyChatsDocument";
import { RaggyChatsDocumentChunk } from "../lib/models/RaggyChatsDocumentChunk";
import { getSentenceChunksFrom } from "../lib/utils";
import FileInputButton from "./FileInputButton";
import useDocuments from "../hooks/use-documents";

type PromptFormProps = {
    handleSendMessage: (query: string) => void;
};

export default function PromptForm({ handleSendMessage }: PromptFormProps) {
    const { error, progress, closeToast, info } = useAlert();

    const [userQuery, setUserQuery] = useState<string>("");

    const { addDocument } = useDocuments();

    const handleFileUpload = useCallback(
        async (selectedFiles: FileList) => {
            const selectedFile = selectedFiles[0];

            if (!RaggyChatsDocument.isSupportedType(selectedFile.type)) {
                error({
                    title: "Document upload failed",
                    message: `"${selectedFile.type}" is not a supported document type yet.\n\nUpcoming supported types:\n\n${RaggyChatsDocument.upcomingSupportedTypes()
                        .map((type) => `"${type}"`)
                        .join(", ")}`,
                });

                return;
            }

            const progressToastId = progress({
                title: "Uploading Document",
                message: "Generating vector embeddings...",
                progressPercentage: 0,
            });

            // Limit the number of concurrent tasks
            const pLimit = (await import("p-limit")).default;
            const limit = pLimit(4); // Adjust the concurrency limit as needed

            const emebeddingAbortController = new AbortController();
            const { signal: emebeddingAbortSignal } = emebeddingAbortController;

            const handleClose = () => {
                limit.clearQueue();
                emebeddingAbortController.abort();
            };

            try {
                const textContent = await selectedFile.text();
                const chunks = getSentenceChunksFrom(textContent, 2000);

                const chunksToBeProcessed = chunks.length;
                let chunksProcessed = 0;
                let progressPercentage = Math.floor((chunksProcessed * 100) / chunksToBeProcessed);

                // Create Models (Document and Chunks)
                const document = new RaggyChatsDocument({
                    fileName: selectedFile.name,
                    type: selectedFile.type,
                });

                const documentChunks: RaggyChatsDocumentChunk[] = [];

                // These vector embedding requests could be concurrent,
                // but would be an overkill since the vectore generation
                // is already super fast
                const tasks = chunks.map((chunk, index) =>
                    limit(async () => {
                        documentChunks[index] = new RaggyChatsDocumentChunk({
                            content: chunk,
                            embedding: await getVectorEmbeddings(
                                chunk,
                                undefined,
                                emebeddingAbortSignal
                            ),
                            documentId: document.id,
                            documentName: document.fileName,
                        });

                        ++chunksProcessed;
                        progressPercentage = Math.floor(
                            (chunksProcessed * 100) / chunksToBeProcessed
                        );

                        progress({
                            id: progressToastId,
                            title: "Uploading Document",
                            message: "Generating vector embeddings...",
                            progressPercentage,
                            updateOnly: true,
                            handleClose,
                        });
                    })
                );

                // Wait for all the tasks to complete
                await Promise.all(tasks);

                if (!emebeddingAbortSignal.aborted) {
                    progress({
                        id: progressToastId,
                        title: "Uploading Document",
                        message: "Saving document info in indexedDB...",
                        progressPercentage,
                        updateOnly: true,
                        handleClose,
                    });

                    await addDocument(document, documentChunks);
                }

                setTimeout(() => {
                    closeToast(progressToastId);

                    info({
                        title: "Document successfully saved",
                        message: "It can now be used to augment your queries to LLM",
                    });
                }, 1000 * 1);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.log(err);
                error({
                    title: "Document upload failed",
                    message: err.message,
                });

                handleClose();
                closeToast(progressToastId);
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
                onKeyUp={(evt) => {
                    if (evt.key === "Enter") {
                        setUserQuery("");
                        handleSendMessage(userQuery);
                    }
                }}
                value={userQuery}
                onChange={(evt) => setUserQuery(evt.target.value)}
                focusBorderColor="purple.500"
                aria-label="Enter your query"
                placeholder={"Enter your query"}
            />

            <InputRightElement>
                <Tooltip label={"Send Message"}>
                    <IconButton
                        onClick={() => {
                            handleSendMessage(userQuery);
                            setUserQuery("");
                        }}
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
