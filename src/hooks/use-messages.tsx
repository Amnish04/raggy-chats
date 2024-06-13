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
    text: "Hi, my name is Raggy Chats. I am your best ever AI powered companion that can help you with wide variety of topics. My interface also allows you to upload different types of documents that I can use to augment my chat completions.",
});

const MessagesContext = createContext<MessagesContextType>({
    messages: [defaultSystemMessage],
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
                    await RaggyChatsMessage.add(defaultSystemMessage);
                    setMessages(await RaggyChatsMessage.getAll());
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
        [error]
    );

    const removeMessage = useCallback(
        async (id: string) => {
            try {
                await RaggyChatsMessage.remove(id);
                setMessages(await RaggyChatsMessage.getAll());
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
