import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles.scss";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.ts";
import { SettingsProvider } from "./hooks/use-settings.tsx";
import { MessagesProvider } from "./hooks/use-messages.tsx";
import { DocumentsProvider } from "./hooks/use-documents.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <SettingsProvider>
                <MessagesProvider>
                    <DocumentsProvider>
                        <App />
                    </DocumentsProvider>
                </MessagesProvider>
            </SettingsProvider>
        </ChakraProvider>
    </React.StrictMode>
);
