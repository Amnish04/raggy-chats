/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAlert } from "./use-alert";
import OpenAI from "openai";
import { listModels } from "../lib/ai";

const ModelsContext = createContext<OpenAI.Model[]>([]);

export const ModelsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [models, setModels] = useState<OpenAI.Model[]>([]);
    const { error } = useAlert();

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const models = await listModels();
                setModels(models);
            } catch (err: any) {
                console.error(err);
                error({
                    title: "Failed to fetch available models",
                    message: err.message,
                });
            }
        };

        fetchModels();
    }, []);

    const value = useMemo(() => models, [models]);

    return <ModelsContext.Provider value={value}>{children}</ModelsContext.Provider>;
};

const useModels = () => useContext(ModelsContext);

export default useModels;
