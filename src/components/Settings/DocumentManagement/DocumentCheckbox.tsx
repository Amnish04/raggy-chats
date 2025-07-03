import { DeleteIcon } from "@chakra-ui/icons";
import {
    Card,
    CardBody,
    CardFooter,
    Checkbox,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Image,
    Stack,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import React, { FC, useCallback } from "react";
import { useAlert } from "../../../hooks/use-alert";
import useDocuments from "../../../hooks/use-documents";
import { RaggyChatsDocument } from "../../../lib/models/RaggyChatsDocument";
import useMobileBreakpoint from "../../../hooks/use-mobile-breakpoint";

type DocumentCheckboxProps = {
    document: RaggyChatsDocument;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const DocumentCheckbox: FC<DocumentCheckboxProps> = ({ document, checked, onChange }) => {
    const { info, error } = useAlert();
    const { deleteDocument } = useDocuments();

    const handleDeleteDocument = useCallback(async () => {
        try {
            await deleteDocument(document.id);

            info({
                title: "Success",
                message: `Document "${document.fileName} has been successfully remove from your vector storage"`,
            });
        } catch (err: any) {
            console.error(err);

            error({
                title: "Failed to delete the document",
                message: err.message,
            });
        }
    }, []);

    const isMobile = useMobileBreakpoint();

    return (
        <Card maxW="sm" width={isMobile ? 250 : 300} height={"100%"}>
            <CardBody>
                {typeof document.icon === "string" ? (
                    <Image
                        src={document.icon}
                        alt={`${document.type} document`}
                        height={150}
                        margin="auto"
                        borderRadius="lg"
                    />
                ) : (
                    // icon is a React component
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        {React.createElement(document.icon, { size: 128 })}
                    </Flex>
                )}
                <Stack mt="6" spacing="3">
                    <Heading size="sm">{document.fileName}</Heading>

                    <Text fontSize="sm">{document.type}</Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter as={Flex} alignItems={"baseline"}>
                <FormControl as={Flex} alignItems={"baseline"}>
                    <FormLabel>Use for RAG?</FormLabel>
                    <Checkbox isChecked={checked} onChange={onChange}></Checkbox>
                </FormControl>

                <Tooltip label={"Delete Document"}>
                    <IconButton
                        onClick={handleDeleteDocument}
                        colorScheme="red"
                        aria-label="Delete document"
                        icon={<DeleteIcon />}
                    ></IconButton>
                </Tooltip>
            </CardFooter>
        </Card>
    );
};

export default DocumentCheckbox;
