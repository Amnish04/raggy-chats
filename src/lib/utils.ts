import nlp from "compromise";

export function tokenize(text: string) {
    const sentences: string[] = nlp(text)
        .json()
        .map((s: { text: string }) => s.text);
    const terms = nlp(text).terms().out("array");

    return { sentences, terms };
}

/**
 *
 * Tries to split the provided text into
 * an array of text chunks where
 * each chunk is composed of one or more sentences.
 *
 * The function attempts to limit each chunk to maximum
 * preferred characters.
 * If a single sentence exceeds preferred character length,
 * that sentence will be force broken into chunks of preferred length
 * with no guarantee that individual chunks make sense.
 *
 * @param text The text content that needs to be split into Chunks
 * @param maxCharsPerSentence Maximum number of characters preferred per chunk
 * @returns Array of text chunks
 */
export function getSentenceChunksFrom(text: string, maxCharsPerSentence: number = 4096): string[] {
    const { sentences } = tokenize(text);
    const chunks: string[] = [];

    let currentText = "";

    for (const sentence of sentences) {
        if (sentence.length >= maxCharsPerSentence) {
            // If the sentence itself is greater than maxCharsPerSentence

            // Flush existing text buffer as a chunk
            if (currentText.length) {
                chunks.push(currentText);
                currentText = "";
            }

            // Force break the long sentence without caring
            // about natural language
            const sentencePieces =
                sentence.match(new RegExp(`.{1,${maxCharsPerSentence}}\\b`, "g")) || [];

            chunks.push(...sentencePieces);
        } else {
            // Check if adding the new sentence to the buffer
            // exceeds the allowed limit.

            // If not, add another sentence to the buffer
            if (currentText.length + sentence.length < maxCharsPerSentence) {
                currentText += ` ${sentence.trim()}`;
            } else {
                // Flush the buffer as a chunk
                if (currentText.length) {
                    chunks.push(currentText);
                }

                currentText = sentence;
            }
        }
    }

    if (currentText.length) {
        chunks.push(currentText);
        currentText = "";
    }

    return chunks;
}

export async function extractTextFromFile(file: File): Promise<string> {
    // My own parsing service :)
    const TEXT_EXTRACTOR_BASE_URL = "https://extract-text-from-file.vercel.app/";
    const TEXT_EXTRACTOR_API_URL = new URL("/api/extract", TEXT_EXTRACTOR_BASE_URL);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(TEXT_EXTRACTOR_API_URL.toString(), {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || `Failed to extract text (status ${response.status})`);
    }

    const { content } = await response.json();

    if (typeof content !== "string") {
        throw new Error("Unexpected response format: 'content' must be a string.");
    }

    return content;
}
