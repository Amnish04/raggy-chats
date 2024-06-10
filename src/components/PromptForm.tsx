import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Tooltip,
} from "@chakra-ui/react";

import { useCallback } from "react";
import { IoMdSend } from "react-icons/io";
import FileInputButton from "./FileInputButton";
import { getVectorEmbeddings } from "../lib/ai";

export default function PromptForm() {
    const handleFileUpload = useCallback(async (selectedFiles: FileList) => {
        const selectedFile = selectedFiles[0];

        console.log(await selectedFile.text());

        const textContent = await selectedFile.text();
        getVectorEmbeddings(textContent);
    }, []);

    return (
        <InputGroup>
            <InputLeftElement>
                <FileInputButton
                    iconButtonProps={{
                        borderRightRadius: "none",
                        "aria-label": "Upload files for RAG",
                    }}
                    onFilesSelected={handleFileUpload}
                />
            </InputLeftElement>

            <Input
                focusBorderColor="purple.500"
                aria-label="Enter your query"
                placeholder={"Enter your query"}
            />

            <InputRightElement>
                <Tooltip label={"Send Message"}>
                    <IconButton
                        aria-label="Send Message"
                        variant={"outline"}
                        border={"none"}
                        borderLeftRadius={"none"}
                        icon={<IoMdSend />}
                    />
                </Tooltip>
            </InputRightElement>
        </InputGroup>
    );
}
