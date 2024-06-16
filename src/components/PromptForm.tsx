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
import { RaggyChatsDocumentChunk, VectorEmbedding } from "../lib/models/RaggyChatsDocumentChunk";
import { getSentenceChunksFrom } from "../lib/utils";
import FileInputButton from "./FileInputButton";

export default function PromptForm() {
    const { error, progress, closeToast, info } = useAlert();

    const [userQuery, setUserQuery] = useState<string>("");

    const handleFileUpload = useCallback(
        async (selectedFiles: FileList) => {
            const selectedFile = selectedFiles[0];

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

                    await document.save();

                    progress({
                        id: progressToastId,
                        title: "Uploading Document",
                        message: "Saving chunks and embeddings in indexedDB...",
                        progressPercentage,
                        updateOnly: true,
                        handleClose,
                    });

                    for (const docChunk of documentChunks) {
                        await docChunk.save();
                    }

                    progress({
                        id: progressToastId,
                        title: "Uploading Document",
                        message: "Saving chunks and embeddings in indexedDB...",
                        progressPercentage: 100,
                        updateOnly: true,
                        handleClose,
                    });
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

                closeToast(progressToastId);
            }
        },
        [closeToast, error, info, progress]
    );

    const handleSendMessage = useCallback(async () => {
        console.log(userQuery);

        if (userQuery.length) {
            // Retrieve, Augment and Generate

            // Generate a vector embedding for user query
            const queryEmbedding = await getVectorEmbeddings(userQuery);
            const mostRelevantChunks = await VectorEmbedding.vectorSearch(queryEmbedding, 10);

            // const relevantContext = `You may use this context to answer any queries:"\n\n ${mostRelevantChunks.map((result) => result.content).join("\n\n")}`;

            console.log(mostRelevantChunks);

            // Chat Completions Here

            setUserQuery("");
        }
    }, [userQuery]);

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
                        handleSendMessage();
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
                        onClick={handleSendMessage}
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
