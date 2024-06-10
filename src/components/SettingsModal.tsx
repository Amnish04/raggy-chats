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
import { ChangeEvent, useCallback, useState } from "react";
import { useDebounce } from "react-use";
import { useSettings } from "../hooks/use-settings";
import PasswordInput from "./PasswordInput";

const SettingsModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleModalOpened = useCallback(() => {
        onOpen();
    }, [onOpen]);

    const { settings, setSettings } = useSettings();

    const [apiKey, setApiKey] = useState<string>(settings.apiKey);

    const [, cancel] = useDebounce(
        () => {
            setSettings({ ...settings, apiKey: apiKey ?? "" });
        },
        500,
        [apiKey]
    );

    const handleApiKeyChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement>) => {
            cancel();
            setApiKey(evt.target.value);
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

            <Modal size={"md"} isOpen={isOpen} onClose={onClose} isCentered={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Settings</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody paddingBottom={10}>
                        <Stack spacing={3}>
                            <FormControl>
                                <FormLabel>API Key</FormLabel>
                                <PasswordInput
                                    value={apiKey}
                                    onChange={handleApiKeyChange}
                                    placeholder={"sp-***************"}
                                />
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
