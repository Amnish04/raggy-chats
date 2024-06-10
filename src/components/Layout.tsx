import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <Box as={"main"} w={"90vw"} margin={"auto"} padding={5}>
            {children}
        </Box>
    );
}
