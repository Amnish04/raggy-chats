/* eslint-disable react-refresh/only-export-components */
import {
    FC,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { RaggyChatsMessage, RaggyChatsMessages } from "../lib/models/RaggyChatsMessage";
import { useAlert } from "./use-alert";

const asyncNoop = async () => {};

type MessagesContextType = {
    messages: RaggyChatsMessages;
    addMessage: (message: RaggyChatsMessage) => Promise<void>;
    removeMessage: (id: string) => Promise<void>;
};

const defaultSystemMessage = new RaggyChatsMessage({
    type: "system",
    text: `I am **Raggy Chats**, an intelligent AI assistant specializing in Retrieval-Augmented Generation (RAG). My primary goal is to assist users by answering questions, summarizing content, and generating relevant text based on the documents they upload.

I always ground my answers in the retrieved context.

My behavior follows these principles:

1. **Cite the Source**: Clearly indicate when an answer is based on retrieved content. Optionally quote or summarize it if helpful. At the end of each response, list the filenames that contributed to the answer in this format:
   - Filename: [filename1.pdf]
   - Filename: [filename2.docx]

2. **Don't Hallucinate**: If the answer isn't in the documents, say so. Never fabricate information.

3. **Be Helpful, Not Overconfident**: If the retrieved content is vague or unrelated, say “I couldn't find relevant information in the uploaded documents,” and explain why the context wasn't helpful.

4. **Answer Format**: Use clear, concise language. Use bullet points or sections if needed. Mention section headers or topics if known. Place all source filenames at the end of the response in a separate section.

I always begin my response based on what was retrieved. If nothing relevant is found, I acknowledge it politely and ask the user to clarify or upload more specific material.
`,
});

const MessagesContext = createContext<MessagesContextType>({
    messages: [],
    addMessage: asyncNoop,
    removeMessage: asyncNoop,
});

export const MessagesProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<RaggyChatsMessages>([]);
    const { error } = useAlert();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await RaggyChatsMessage.getAll();
                if (messages.length) {
                    setMessages(messages);
                } else {
                    await addMessage(defaultSystemMessage);
                }
            } catch (err: any) {
                console.error(err);
                error({
                    title: "Failed to initiate chat",
                    message: err.message,
                });
            }
        };

        fetchMessages();
    }, []);

    const addMessage = useCallback(
        async (message: RaggyChatsMessage) => {
            try {
                await RaggyChatsMessage.add(message);
                setMessages((prevValue) => [...prevValue, new RaggyChatsMessage(message)]);
            } catch (err: any) {
                console.error(err);
                error({
                    title: "Failed to add message",
                    message: err.message,
                });
            }
        },
        [error, setMessages]
    );

    const removeMessage = useCallback(
        async (id: string) => {
            try {
                await RaggyChatsMessage.remove(id);

                const latestMessages = await RaggyChatsMessage.getAll();
                setMessages(latestMessages);
            } catch (err: any) {
                console.error(err);
                error({
                    title: "Failed to remove message",
                    message: err.message,
                });
            }
        },
        [error]
    );

    const value = useMemo(
        () => ({
            messages,
            addMessage,
            removeMessage,
        }),
        [messages, addMessage, removeMessage]
    );

    return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};

const useMessages = () => useContext(MessagesContext);

export default useMessages;
