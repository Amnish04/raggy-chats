import { Box, Image, Link } from "@chakra-ui/react";

const RaggyChatsLogo = () => {
    return (
        <Link
            w={24}
            href="#"
            display={"inline-block"}
            _hover={{ rotate: "25deg" }}
        >
            <Image
                borderRadius={"50%"}
                src={"./raggy-chats-logo.png"}
                alt={"Raggy Chats"}
            />
        </Link>
    );
};

export default function Header() {
    return (
        <Box
            as={"header"}
            padding={2}
            backgroundColor={"black"}
            boxShadow={"2xl"}
            backgroundBlendMode={"lighten"}
        >
            <RaggyChatsLogo />
        </Box>
    );
}
