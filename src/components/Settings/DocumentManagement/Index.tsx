import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    Text,
} from "@chakra-ui/react";
import useDocuments from "../../../hooks/use-documents";
import useMobileBreakpoint from "../../../hooks/use-mobile-breakpoint";
import DocumentCheckbox from "./DocumentCheckbox";

export default function DocumentManagement() {
    const { documents, toggleUseForRAG } = useDocuments();
    const isMobile = useMobileBreakpoint(700);

    return (
        <Box as="section">
            <FormControl as="fieldset">
                <FormLabel as="legend">Document Management</FormLabel>

                {!!documents.length && (
                    <>
                        <FormHelperText marginTop={0} marginBottom={5}>
                            Select the documents to be included in context retrieval
                        </FormHelperText>

                        {/* Group of document checkboxes */}
                        <Grid gridTemplateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"} gap={5}>
                            {documents.map((document) => (
                                <GridItem
                                    justifySelf={"center"}
                                    key={`document-checkbox-${document.id}`}
                                >
                                    <DocumentCheckbox
                                        document={document}
                                        checked={document.useForRAG}
                                        onChange={() => toggleUseForRAG(document.id)}
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    </>
                )}

                {/* If not documents uploaded so far */}
                {!documents.length && (
                    <Text fontSize={"sm"}>
                        You haven't uploaded any documents for context augmentation.
                    </Text>
                )}
            </FormControl>
        </Box>
    );
}
