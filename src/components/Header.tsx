import { Flex, Heading, Image, Link } from "@chakra-ui/react";
import SettingsModal from "./SettingsModal";

const RaggyChatsLogo = () => {
    return (
        <Link w={24} href="#" display={"block"} _hover={{ rotate: "25deg" }}>
            <Image borderRadius={"50%"} src={"./raggy-chats-logo.png"} alt={"Raggy Chats"} />
        </Link>
    );
};

export default function Header() {
    return (
        <Flex
            as={"header"}
            padding={2}
            backgroundColor={"black"}
            backgroundBlendMode={"lighten"}
            justifyContent={"space-between"}
            alignItems={"center"}
        >
            <Flex gap={4}>
                <RaggyChatsLogo />

                <Heading margin={"auto"} as={"h1"} size={"lg"} color={"white"}>
                    Upload Docs and Ask Questions!
                </Heading>
            </Flex>

            <SettingsModal />
        </Flex>
    );
}
