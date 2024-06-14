import { Box, Grid } from "@chakra-ui/react";
import useMessages from "../../hooks/use-messages";
import Message from "../Messages/Message";
import PromptForm from "../PromptForm";

export default function ChatBase() {
    const { messages } = useMessages();

    return (
        <Grid
            gridTemplateRows={"6fr 1fr"}
            gridTemplateColumns={"1fr"}
            height={"calc(100vh - 160px)"}
            paddingBlock={5}
        >
            {/* Messages */}
            <Box overflowY={"auto"}>
                <Box w={"80vw"} marginInline={"auto"}>
                    {messages.map((message) => (
                        <Message key={`message-${message.id}`} />
                    ))}
                </Box>
            </Box>
            {/* Prompt Form */}
            <Box w={"80vw"} marginInline={"auto"} alignSelf={"end"}>
                <PromptForm />
            </Box>
        </Grid>
    );
}
