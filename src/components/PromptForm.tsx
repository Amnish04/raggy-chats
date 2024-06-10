import { ArrowRightIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Tooltip
} from "@chakra-ui/react";

import FileInputButton from "./FileInputButton";
import { useCallback } from "react";

export default function PromptForm() {
    const handleFileUpload = useCallback(async (selectedFiles: FileList) => {
        const selectedFile = selectedFiles[0];

        console.log(await selectedFile.text());
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

        <Input focusBorderColor="purple.500" aria-label="Enter your query" placeholder={"Enter your query"} />

        <InputRightElement>
            <Tooltip label={"Send Message"}>
            <IconButton
            aria-label="Send Message"
            variant={"outline"}
            border={"none"}
            borderLeftRadius={"none"}
            icon={<ArrowRightIcon />}
            />
            </Tooltip>
        </InputRightElement>
    </InputGroup>
  );
}
