# I am the /health endpoint returning full live service metrics.
# I've made sure this endpoint is always exempt from rate limiting.
import os
import logging
from flask import Blueprint, jsonify
from services.chroma_client import get_collection_count
from services.metrics import get_avg_response_time_ms, get_cache_stats, get_uptime_seconds

logger = logging.getLogger(__name__)
health_bp = Blueprint('health', __name__)

# I've hardcoded the AI model name here — it must match my call_groq() model parameter exactly.
AI_MODEL = "llama-3.3-70b-versatile"


@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    I return live health metrics for my AI service.
    I've included fields for status, model, average response time, document count, uptime, and cache stats.
    """
    try:
        # I'm fetching the current document count from my ChromaDB collection.
        chroma_count = get_collection_count()
    except Exception as e:
        logger.warning(f"I couldn't get the ChromaDB doc count: {e}")
        chroma_count = -1

    # I'm grabbing my latest cache stats from my metrics service.
    cache_stats = get_cache_stats()

    return jsonify({
        "status": "healthy",
        "model": AI_MODEL,
        "avg_response_time_ms": get_avg_response_time_ms(),
        "chroma_doc_count": chroma_count,
        "uptime_seconds": get_uptime_seconds(),
        "cache_hits": cache_stats["hits"],
        "cache_misses": cache_stats["misses"],
        "service": "ai-service",
        "port": 5000
    }), 200

