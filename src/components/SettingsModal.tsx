import { SettingsIcon } from "@chakra-ui/icons";
import {
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { useCallback } from "react";
import PasswordInput from "./PasswordInput";

const SettingsModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleModalOpened = useCallback(() => {
        onOpen();
    }, [onOpen]);

    return (
        <>
            <Tooltip label={"Open Settings"}>
                <IconButton
                    marginRight={"1rem"}
                    colorScheme={"none"}
                    aria-label="Open Settings"
                    onClick={handleModalOpened}
                    icon={<SettingsIcon />}
                />
            </Tooltip>

            <Modal size={"md"} isOpen={isOpen} onClose={onClose} isCentered={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Settings</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody paddingBottom={10}>
                        <Stack spacing={3}>
                            <FormControl>
                                <FormLabel>API Key</FormLabel>
                                <PasswordInput placeholder={"sp-***************"} />
                                <FormHelperText>
                                    Please enter your OpenAI API Key to be used for chat completions
                                </FormHelperText>
                            </FormControl>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SettingsModal;
