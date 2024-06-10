import { Flex, Image, Link } from "@chakra-ui/react";
import SettingsModal from "./SettingsModal";

const RaggyChatsLogo = () => {
    return (
        <Link w={24} href="#" display={"inline-block"} _hover={{ rotate: "25deg" }}>
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
            boxShadow={"2xl"}
            backgroundBlendMode={"lighten"}
            justifyContent={"space-between"}
            alignItems={"center"}
        >
            <RaggyChatsLogo />

            <SettingsModal />
        </Flex>
    );
}
