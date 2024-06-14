import { Box } from "@chakra-ui/react";
import ChatBase from "./components/Chats/ChatBase";
import Header from "./components/Header";

function App() {
    return (
        <>
            <Header />

            <Box as="main">
                <ChatBase />
            </Box>
        </>
    );
}

export default App;
