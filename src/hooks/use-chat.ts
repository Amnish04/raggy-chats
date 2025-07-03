import { useState } from "react";
import { chatCompletions } from "../lib/ai";
import { AiMessage } from "../lib/models/AiMessage";
import {
    MessageType,
    RaggyChatsMessage,
    RaggyChatsMessages,
} from "../lib/models/RaggyChatsMessage";
import useMessages from "./use-messages";
import { useSettings } from "./use-settings";

type UseChatUtilities = {
    streamingMessage: RaggyChatsMessage | null;
    generateChatCompletions: (
        messages: RaggyChatsMessages,
        scrollCallback: () => void
    ) => Promise<void>;
};

export const useChat = (): UseChatUtilities => {
    const [streamingMessage, setStreamingMessage] = useState<RaggyChatsMessage | null>(null);
    const { addMessage } = useMessages();
    const { settings } = useSettings();

    async function generateChatCompletions(
        messages: RaggyChatsMessages,
        scrollCallback: () => void
    ) {
        const selectedModel = settings.selectedModel;
        const stream = await chatCompletions(
            selectedModel,
            messages.map((message) => new AiMessage(message.type, message.text))
        );

        for await (const chunk of stream) {
            const chunkMessage = chunk.choices[0].delta;

            setStreamingMessage((prevMessage) => {
                return prevMessage === null
                    ? new RaggyChatsMessage({
                          text: chunkMessage.content ?? "",
                          type: chunkMessage.role as MessageType,
                      })
                    : new RaggyChatsMessage({
                          ...prevMessage,
                          text: `${prevMessage.text} ${chunkMessage.content}`,
                      });
            });

            scrollCallback();
        }

        const finalMessage = (await stream.finalChatCompletion()).choices[0].message;

        setStreamingMessage(null);

        await addMessage(
            new RaggyChatsMessage({
                type: finalMessage.role,
                text: finalMessage.content ?? "",
                model: selectedModel,
            })
        );

        scrollCallback();
    }

    return {
        streamingMessage,
        generateChatCompletions,
    };
};
