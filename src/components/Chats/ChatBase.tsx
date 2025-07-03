import { Box, Flex, Grid } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useChat } from "../../hooks/use-chat";
import useMessages from "../../hooks/use-messages";
import { getVectorEmbeddings } from "../../lib/ai";
import { VectorEmbedding } from "../../lib/models/RaggyChatsDocumentChunk";
import { RaggyChatsMessage, RaggyChatsMessages } from "../../lib/models/RaggyChatsMessage";
import Message from "../Messages/Message";
import PromptForm from "../PromptForm";
import { useAlert } from "../../hooks/use-alert";

export default function ChatBase() {
    const { messages, addMessage } = useMessages();
    const { error } = useAlert();
    const { streamingMessage, generateChatCompletions } = useChat();
    const messagesArea = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            const element = messagesArea.current;

            if (element) {
                element.scrollTop = element.scrollHeight;
            }
        }, 0);
    }, []);

    const handleSendMessage = useCallback(
        async (userQuery: string) => {
            if (userQuery.length) {
                try {
                    // Retrieve, Augment and Generate

                    await addMessage(new RaggyChatsMessage({ type: "user", text: userQuery }));
                    scrollToBottom();

                    // Generate a vector embedding for user query
                    const queryEmbedding = await getVectorEmbeddings(userQuery);
                    const mostRelevantChunks = await VectorEmbedding.vectorSearch(
                        queryEmbedding,
                        10
                    );

                    const documentContextMessages: RaggyChatsMessages = [];
                    if (mostRelevantChunks.length) {
                        documentContextMessages.push(
                            new RaggyChatsMessage({
                                type: "user",
                                text: "You may use this context to answer any queries.",
                            })
                        );

                        mostRelevantChunks.forEach((relevantChunk) => {
                            documentContextMessages.push(
                                new RaggyChatsMessage({
                                    type: "user",
                                    // It is important to include the filename for valid citations to be generated
                                    text: `**Filename:** ${relevantChunk.documentName}\n**Content:** \n${relevantChunk.content}\n\n`,
                                })
                            );
                        });
                    }

                    const chatMessages = messages.filter((m) => m.type !== "system");
                    const systemMessages = messages.filter((m) => m.type === "system");

                    // Chat Completions Here
                    await generateChatCompletions(
                        [
                            ...systemMessages,
                            ...documentContextMessages,
                            ...chatMessages,
                            new RaggyChatsMessage({ type: "user", text: userQuery }),
                        ],
                        scrollToBottom
                    );
                } catch (err: any) {
                    console.error(err);

                    error({
                        title: "Failed to generate a response",
                        message: err.message,
                    });
                }
            }
        },
        [messages]
    );

    return (
        <Grid
            gridTemplateRows={"6fr 1fr"}
            gridTemplateColumns={"1fr"}
            height={"calc(100vh - 160px)"}
            paddingBlock={5}
        >
            {/* Messages */}
            <Box ref={messagesArea} overflowY={"auto"}>
                <Flex direction={"column"} gap={5} w={"80vw"} marginInline={"auto"}>
                    {messages.map((message) => (
                        <Message key={`message-${message.id}`} message={message} />
                    ))}

                    {streamingMessage && (
                        <Message
                            key={`message-${streamingMessage.id}`}
                            message={streamingMessage}
                        />
                    )}
                </Flex>
            </Box>
            {/* Prompt Form */}
            <Box w={"80vw"} marginInline={"auto"} alignSelf={"end"}>
                <PromptForm handleSendMessage={handleSendMessage} />
            </Box>
        </Grid>
    );
}
