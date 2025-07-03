import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAlert } from "../../hooks/use-alert";
import useMessages from "../../hooks/use-messages";
import { RaggyChatsMessage } from "../../lib/models/RaggyChatsMessage";
import Markdown from "./Markdown";
import "./Message.scss";
import { useSettings } from "../../hooks/use-settings";

type MessageMenuProps = {
    message: RaggyChatsMessage;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessageMenu = ({ message, setIsEditing }: MessageMenuProps) => {
    const { error, success } = useAlert();

    const { removeMessage } = useMessages();

    const deleteMessage = useCallback(async () => {
        try {
            await removeMessage(message.id);

            success({
                title: "Message deleted successfully",
            });
        } catch (err: any) {
            console.error(err);
            error({
                title: "Failed to delete message",
                message: err.message,
            });
        }
    }, [message]);

    const editMessage = useCallback(() => {
        setIsEditing((prev) => !prev);
    }, [message]);

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                colorScheme="gray"
                aria-label="Options"
                icon={<BsThreeDotsVertical />}
                variant="ghost"
            />
            <MenuList>
                <MenuItem onClick={editMessage} icon={<EditIcon />}>
                    Edit
                </MenuItem>
                <MenuItem onClick={deleteMessage} color={"red.500"} icon={<DeleteIcon />}>
                    Delete
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

type MessageProps = {
    message: RaggyChatsMessage;
};

export default function Message({ message }: MessageProps) {
    const { settings } = useSettings();
    const [isEditing, setIsEditing] = useState(false);
    const [editorValue, setEditorValue] = useState(message.text);
    const { updateMessage } = useMessages();

    const messageTitle = useMemo(() => {
        let title = "";

        switch (message.type) {
            case "system":
                title = "System Prompt";
                break;
            case "user":
                title = "User";
                break;
            case "assistant":
                title = message.model || settings.selectedModel;
                break;
        }

        return title;
    }, [message]);

    const reset = useCallback(() => {
        setEditorValue(message.text);
        setIsEditing(false);
    }, [message.text]);

    const save = useCallback(async () => {
        // Update the message in IndexedDB
        await updateMessage(message.id, editorValue);

        // Exit the editing state
        setIsEditing(false);
    }, [editorValue, message.id]);

    return (
        <Card
            maxW={message.type !== "system" ? "70vw" : "full"}
            margin={message.type === "system" ? "auto" : 0}
            marginLeft={message.type === "user" ? "auto" : 0}
            marginRight={message.type === "assistant" ? "auto" : 0}
        >
            <CardHeader>
                <Flex gap={4}>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Avatar
                            name="Raggy Chats"
                            src="/openai-icon.svg"
                            size={"sm"}
                            objectFit={"fill"}
                            objectPosition={"center"}
                        />

                        <Box>
                            <Heading size="sm">{messageTitle}</Heading>

                            <Text size="sm" color={"rgba(0, 0, 0, 0.70)"}>
                                {message.date.toLocaleString()}
                            </Text>
                        </Box>
                    </Flex>

                    <MessageMenu message={message} setIsEditing={setIsEditing} />
                </Flex>
            </CardHeader>
            <CardBody paddingTop={0}>
                {isEditing ? (
                    <Stack spacing={"2"}>
                        <Textarea
                            w={"xl"}
                            value={editorValue}
                            onChange={(e) => {
                                let inputValue = e.target.value;
                                setEditorValue(inputValue);
                            }}
                            placeholder="Message content here..."
                            size="lg"
                        />

                        <Flex justifyContent={"flex-end"} gap={3} paddingTop={2}>
                            <Button colorScheme={"red"} size={"xs"} onClick={reset}>
                                Cancel
                            </Button>
                            <Button size={"xs"} onClick={save}>
                                Save
                            </Button>
                        </Flex>
                    </Stack>
                ) : (
                    <Markdown isLoading={false}>{message.text}</Markdown>
                )}
            </CardBody>
        </Card>
    );
}
