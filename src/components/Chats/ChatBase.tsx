import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useChat } from "../../hooks/use-chat";
import useMessages from "../../hooks/use-messages";
import { getVectorEmbeddings } from "../../lib/ai";
import { VectorEmbedding } from "../../lib/models/RaggyChatsDocumentChunk";
import { RaggyChatsMessage } from "../../lib/models/RaggyChatsMessage";
import Message from "../Messages/Message";
import PromptForm from "../PromptForm";

export default function ChatBase() {
    const { messages, addMessage } = useMessages();

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

    const handleSendMessage = useCallback(async (userQuery: string) => {
        console.log(userQuery);

        if (userQuery.length) {
            // Retrieve, Augment and Generate

            await addMessage(new RaggyChatsMessage({ type: "user", text: userQuery }));
            scrollToBottom();

            // Generate a vector embedding for user query
            const queryEmbedding = await getVectorEmbeddings(userQuery);
            const mostRelevantChunks = await VectorEmbedding.vectorSearch(queryEmbedding, 10);

            const relevantContext = `You may use this context to answer any queries, if applicable. But you don't always have to as the question might not be based on this context. So focus more on the other existing messages in the chat:"\n\n ${mostRelevantChunks.map((result) => result.content).join("\n\n")}`;
            const augmentedUserQuery = `${mostRelevantChunks.length ? `${relevantContext}\n\n` : ""}User Query: ${userQuery}`;

            console.log(augmentedUserQuery);

            // Chat Completions Here
            await generateChatCompletions(
                [...messages, new RaggyChatsMessage({ type: "user", text: augmentedUserQuery })],
                scrollToBottom
            );
        }
    }, []);

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
                </Flex>

                {streamingMessage && <Text>{streamingMessage}</Text>}
            </Box>
            {/* Prompt Form */}
            <Box w={"80vw"} marginInline={"auto"} alignSelf={"end"}>
                <PromptForm handleSendMessage={handleSendMessage} />
            </Box>
        </Grid>
    );
}
