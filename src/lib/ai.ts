import OpenAI from "openai";
import { getSettings } from "./settings";

export const OPENAI_API_URL = "https://api.openai.com/v1";

export async function validateApiKey(key: string) {
    // Use response from https://openrouter.ai/docs#limits to check if API key is valid
    const res = await fetch(`${OPENAI_API_URL}/models`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${key}`,
        },
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${await res.text()}`);
    }

    return true;
}

function createClient(key: string) {
    const clientHeaders = {};

    return {
        openai: new OpenAI({
            apiKey: key,
            baseURL: OPENAI_API_URL,
            defaultHeaders: clientHeaders,
            dangerouslyAllowBrowser: true,
        }),
        headers: clientHeaders,
    };
}

type OpenAiEmbeddingModel =
    | "text-embedding-3-small"
    | "text-embedding-ada-002"
    | "text-embedding-3-large";

export async function getVectorEmbeddings(
    content: string,
    model: OpenAiEmbeddingModel = "text-embedding-3-small"
) {
    const { apiKey } = getSettings();
    const { openai } = createClient(apiKey);

    const embedding = await openai.embeddings.create({
        model: model,
        input: content,
        encoding_format: "float",
    });

    console.log(embedding);
    return embedding;
}
