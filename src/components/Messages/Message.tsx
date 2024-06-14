import {
    Avatar,
    Box,
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
    Text,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RaggyChatsMessage } from "../../lib/models/RaggyChatsMessage";
import { useCallback, useMemo } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useAlert } from "../../hooks/use-alert";
import useMessages from "../../hooks/use-messages";

type MessageMenuProps = {
    message: RaggyChatsMessage;
};

const MessageMenu = ({ message }: MessageMenuProps) => {
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
        console.log(`Editing message ${message.id}`);
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
    const messageTitle = useMemo(() => {
        let title = "";

        switch (message.type) {
            case "system":
                title = "System Prompt";
                break;
            case "human":
                title = "User";
                break;
            case "ai":
                title = message.model ?? "GPT-Unknown";
                break;
        }

        return title;
    }, [message]);

    return (
        <Card
            maxW={message.type !== "system" ? "5xl" : "full"}
            margin={message.type === "system" ? "auto" : 0}
            marginLeft={message.type === "ai" ? "auto" : 0}
            marginRight={message.type === "human" ? "auto" : 0}
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
                        </Box>
                    </Flex>

                    <MessageMenu message={message} />
                </Flex>
            </CardHeader>
            <CardBody paddingTop={0}>
                <Text>{message.text}</Text>
            </CardBody>
        </Card>
    );
}
