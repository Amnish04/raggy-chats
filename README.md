<h1 align="center">Raggy Chats</h1>

<p align="center">
    A specialized RAG ChatBot with an IndexedDB knowledge base.
</p>

<img width="1898" alt="Raggy chats home page" src="https://github.com/user-attachments/assets/0a7f7c3c-3c88-4ac6-b8b0-950faf6c2556" />

❗ Are you frustrated by [LLM's Hallucinations](https://medium.com/low-code-for-advanced-data-science/what-are-ai-hallucinations-how-to-mitigate-them-in-llms-4abf0cd54a7a) on queries about things its not trained on?

❗ Are you looking for a companion that can **read your documents**, make sense of it, and help?

❗ Are you **uncomfortable** with your **personal conversations** with LLM being stored in someone's database?

Here's a hero for the rescue 🦸‍♂️

**Raggy Chats** is a lightweight AI chatbot, focusing specifically on [Retrieval Augemented Generation](https://research.ibm.com/blog/retrieval-augmented-generation-RAG) (RAG), with your documents' embeddings stored locally in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

Users **upload documents** relevant to the context of their queries, and **Raggy Chats** conducts [semantic search](https://help.openai.com/en/articles/8868588-retrieval-augmented-generation-rag-and-semantic-search-for-gpts) on documents' content, **ranks** the most **relevant** chunks using [Cosine Similarity](https://www.youtube.com/watch?v=e9U0QAFbfLI), and augments the original query with retrieved context from uploaded documents.

## Getting Started

**Raggy Chats** requires minimal configuration and it's super easy to get started!

1. Open settings by clicking the button on top right.
<img width="1639" alt="image" src="https://github.com/user-attachments/assets/06bea39f-39bc-4e9f-bcfa-0eadc5906981" />

2. Configure your [API key](https://platform.openai.com/api-keys). Note that only **OpenAI** is supported for now.
<div align="center">
    <img width="641" alt="image" src="https://github.com/user-attachments/assets/419ffcb4-ed4b-4a23-9b30-4a3f73420fcf" />
</div>

3. Upload relevant documents, after returning to the home page.
<img width="1399" alt="image" src="https://github.com/user-attachments/assets/a9a1d864-49e2-42f7-8802-43c4622cb818" />

4. You also have the ability to configure what documents to **include** in context retrieval. Make sure "**Use for RAG**" is turned on for all the documents that you want to use.
<div align="center">
    <img width="753" alt="image" src="https://github.com/user-attachments/assets/8c3769ec-ca1b-440d-8552-c00334bef93b" />
</div>

And that's all you need to hit the ground running with **Raggy Chats**!

## References

- [Dexie.js](https://dexie.org/) was used to manage the embeddings in IndexedDB.
- Learn more about [RAG](https://www.promptingguide.ai/techniques/rag)
