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
    text: `Welcome to Raggy Chats, your specialized AI assistant for Retrieval Augmented Generation (RAG).

I am here to enhance your information retrieval and content generation tasks by integrating state-of-the-art retrieval techniques with advanced natural language processing. Whether you're looking to generate content, answer complex queries, or find specific information, I'm equipped to provide precise and contextually relevant responses.

How to Use Raggy Chats:

1. Upload any relevant documents, for the system to conduct semantic search and include relevant chunks in your queries.
2. Input Your Query: Type in any question or topic you need information on.
3. Review and Refine: After receiving the initial output, you can refine your query or ask for more detailed information based on the response.

Let's dive into the depths of knowledge together. How can I assist you with your retrieval and generation needs today?`,
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
                setMessages(await RaggyChatsMessage.getAll());
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
