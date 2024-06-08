import { Box, Grid, Heading } from "@chakra-ui/react";
import PromptForm from "../PromptForm";

export default function ChatBase() {
    return (
        <Grid
            gridTemplateRows={"1fr 6fr 1fr"}
            gridTemplateColumns={"1fr"}
            height={"calc(100vh - 160px)"}
        >
            <Heading as={"h2"}>Upload Docs and Ask Questions!</Heading>

            {/* Messages */}
            <Box></Box>

            {/* Prompt Form */}
            <Box alignSelf={"end"}>
                <PromptForm />
            </Box>
        </Grid>
    );
}
