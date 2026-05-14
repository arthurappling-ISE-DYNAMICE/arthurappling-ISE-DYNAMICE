# SEARCH ENGINE ARCHITECTURE: Prime Pathwy Sovereign OS

## 1. Search Philosophy
In a forensic evidence platform, data retrieval must be instantaneous and exhaustive. The Prime Pathwy Sovereign OS implements a multi-layered search architecture, moving from exact-match relational queries to full-text indexing, with a roadmap toward semantic vector search.

## 2. Relational & Full-Text Search (Current Architecture)

### 2.1 SQLite FTS5 Integration
The core search capability is powered by SQLite's FTS5 (Full-Text Search) extension. This provides a massive performance upgrade over standard `LIKE '%keyword%'` SQL queries.
- **Virtual Tables:** An FTS5 virtual table is created, mirroring the core searchable data (Vendor names, Work Order descriptions, Invoice numbers, and crucially, the raw `ocr_text` from receipts).
- **Triggers:** Database triggers are implemented so that whenever a `Receipt` or `WorkOrder` is inserted or updated, the corresponding FTS5 virtual table is automatically synchronized.
- **Query Execution:** When a user enters a global search term (e.g., "Home Depot Concrete"), the system queries the FTS5 table, utilizing its built-in ranking algorithms (BM25) to return the most relevant entities in sub-second time, even across millions of records.

### 2.2 Metadata Filtering
FTS is combined with strict metadata filtering. Users can combine a full-text search with relational constraints:
- *Search:* "Lumber"
- *Filter:* `Date >= 2024-01-01 AND Amount > $500.00`

## 3. Semantic Search & Vector Database (Roadmap)
Traditional keyword search fails when terminology varies (e.g., searching for "fuel" when the receipt says "gasoline"). The AI Roadmap includes upgrading the search engine to support Semantic Search.

### 3.1 Local Embedding Architecture
- **Embedding Model:** A lightweight, locally executed embedding model (e.g., `sentence-transformers/all-MiniLM-L6-v2`) will convert the text of every receipt, work order, and audit log into a dense vector representation.
- **Vector Storage:** These vectors will be stored in a local vector database (such as ChromaDB or pgvector when migrating to PostgreSQL).

### 3.2 Natural Language Retrieval
When an administrator queries the system using natural language (e.g., *"Find expenses related to vehicle maintenance from last winter"*), the query is embedded into a vector. The search engine then performs a nearest-neighbor search (e.g., Cosine Similarity or HNSW) against the vector database.
This allows the system to retrieve highly relevant documents based on their *meaning* and context, rather than relying on exact keyword matches, drastically accelerating forensic investigations and audit preparation.
