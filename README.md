<h1 align="center">Raggy Chats</h1>

<p align="center">
    A specialized RAG ChatBot with an IndexedDB knowledge base.
</p>

![RaggyChatsHomePage](https://github.com/Amnish04/raggy-chats/assets/78865303/0379b085-d98b-4b95-9a20-41167a207941)

❗ Are you frustrated by [LLM's Hallucinations](https://medium.com/low-code-for-advanced-data-science/what-are-ai-hallucinations-how-to-mitigate-them-in-llms-4abf0cd54a7a) on queries about things its not trained on?

❗ Are you looking for a companion that can **read your documents**, make sense of it, and help?

❗ Are you **uncomfortable** with your **personal conversations** with LLM being stored in someone's database?

Here's a hero for the rescue 🦸‍♂️

**Raggy Chats** is a lightweight AI chatbot, focusing specifically on [Retrieval Augemented Generation](https://research.ibm.com/blog/retrieval-augmented-generation-RAG) (RAG), with your documents' embeddings stored locally in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

Users **upload documents** relevant to the context of their queries, and **Raggy Chats** conducts [semantic search](https://help.openai.com/en/articles/8868588-retrieval-augmented-generation-rag-and-semantic-search-for-gpts) on documents' content, **ranks** the most **relevant** chunks using [Cosine Similarity](https://www.youtube.com/watch?v=e9U0QAFbfLI), and augments the original query with retrieved context from uploaded documents.
