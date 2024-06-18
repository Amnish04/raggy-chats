import { useState } from "react";
import { GPT_MODEL, chatCompletions } from "../lib/ai";
import { AiMessage } from "../lib/models/AiMessage";
import { RaggyChatsMessage, RaggyChatsMessages } from "../lib/models/RaggyChatsMessage";
import useMessages from "./use-messages";

type UseChatUtilities = {
    streamingMessage: string | null;
    generateChatCompletions: (
        messages: RaggyChatsMessages,
        scrollCallback: () => void
    ) => Promise<void>;
};

export const useChat = (): UseChatUtilities => {
    const [streamingMessage] = useState<string | null>(null);
    const { addMessage } = useMessages();

    async function generateChatCompletions(
        messages: RaggyChatsMessages,
        scrollCallback: () => void
    ) {
        // TODO: Replace hard coded model with an option in settings
        const response = await chatCompletions(
            GPT_MODEL,
            messages.map((message) => new AiMessage(message.type, message.text))
        );

        console.log(response);
        const message = response.choices[0].message;
        // setStreamingMessage(response.choices[0].message.content);

        await addMessage(
            new RaggyChatsMessage({ type: message.role, text: message.content ?? "" })
        );
        scrollCallback();
    }

    return {
        streamingMessage,
        generateChatCompletions,
    };
};
