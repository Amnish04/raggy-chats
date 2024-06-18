import { MessageType } from "./RaggyChatsMessage";

export class AiMessage {
    constructor(
        public role: MessageType,
        public content: string
    ) {}

    private static DONE_TOKEN: string = "[DONE]";

    isDoneMessage(): boolean {
        return this.content === AiMessage.DONE_TOKEN;
    }
}

export type AiMessages = AiMessage[];
