import { SettingsIcon } from "@chakra-ui/icons";
import {
    FormControl,
    FormErrorMessage,
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
import { ChangeEvent, useCallback, useState } from "react";
import { useDebounce } from "react-use";
import { useSettings } from "../../hooks/use-settings";
import PasswordInput from "../PasswordInput";
import { validateApiKey } from "../../lib/ai";
import DocumentsManagement from "./DocumentsManagement";

const SettingsModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleModalOpened = useCallback(() => {
        onOpen();
    }, [onOpen]);

    const { settings, setSettings } = useSettings();

    const [apiKey, setApiKey] = useState<string>(settings.apiKey);
    const [isKeyValid, setIsKeyValid] = useState<boolean>(true);

    const [, cancel] = useDebounce(
        () => {
            setSettings({ ...settings, apiKey: apiKey ?? "" });
        },
        500,
        [apiKey]
    );

    const handleApiKeyChange = useCallback(
        async (evt: ChangeEvent<HTMLInputElement>) => {
            cancel();

            const enteredKey = evt.target.value;

            setApiKey(enteredKey);

            try {
                const result = await validateApiKey(enteredKey);

                setIsKeyValid(result);
            } catch {
                setIsKeyValid(false);
            }
        },
        [cancel]
    );

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

            <Modal
                scrollBehavior="inside"
                size={"3xl"}
                isOpen={isOpen}
                onClose={onClose}
                isCentered={true}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Settings</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody paddingBottom={10}>
                        <Stack spacing={3}>
                            <FormControl isInvalid={!isKeyValid}>
                                <FormLabel>API Key</FormLabel>
                                <PasswordInput
                                    value={apiKey}
                                    isInvalid={!isKeyValid}
                                    onChange={handleApiKeyChange}
                                    placeholder={"sk-***************"}
                                />

                                {isKeyValid ? (
                                    <FormHelperText>
                                        Please enter your OpenAI API Key to be used for chat
                                        completions
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>
                                        Please enter a valid API key
                                    </FormErrorMessage>
                                )}
                            </FormControl>

                            <DocumentsManagement />
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SettingsModal;
