import os
import logging
import chromadb
from sentence_transformers import SentenceTransformer

# Disable ChromaDB telemetry warnings
os.environ['ANONYMIZED_TELEMETRY'] = 'False'

# I am defining the persistent path for ChromaDB storage
CHROMA_PATH = os.getenv('CHROMA_PATH', './chroma_data')

# I am using the global Singleton Pattern here so I only load these ONCE!
_model = None
_collection = None

def get_model():
    global _model
    if _model is None:
        # Loading the sentence-transformer model - this takes 5-10s, so it must only happen once!
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def get_collection():
    global _collection
    if _collection is None:
        # I am setting up the persistent client and initializing cosine similarity!
        client = chromadb.PersistentClient(path=CHROMA_PATH)
        _collection = client.get_or_create_collection(
            name='ai_risk_knowledge',
            metadata={'hnsw:space': 'cosine'} # MUST be cosine as per specs
        )
    return _collection

def query_knowledge_base(question: str, n=3) -> list[dict]:
    # I am encoding the question and querying my RAG knowledge base
    embedding = get_model().encode(question).tolist()
    results = get_collection().query(
        query_embeddings=[embedding], n_results=n,
        include=['documents', 'metadatas', 'distances']
    )
    
    return [
        {
            'text': results['documents'][0][i],
            'source': results['metadatas'][0][i].get('source', '?'),
            'distance': results['distances'][0][i]
        }
        for i in range(len(results['documents'][0]))
    ]

def get_collection_count() -> int:
    """Return the total number of documents in the ChromaDB collection."""
    try:
        return get_collection().count()
    except Exception:
        return -1
