# I am a utility that builds the standardised meta object for all my AI endpoint responses.
# By centralising this, I ensure that my field names and types are consistent across every endpoint.
import time
from datetime import datetime, timezone

# This is the model I'm currently using.
AI_MODEL_NAME = "llama-3.3-70b-versatile"


def build_meta(
    response_time_ms: float,
    cached: bool,
    confidence: float = 0.85,
    tokens_used: int = 0
) -> dict:
    """
    I use this to build the standardised meta object for inclusion in all my AI endpoint responses.
    """
    return {
        "model_used": AI_MODEL_NAME,
        "response_time_ms": round(response_time_ms, 1),
        "cached": cached,
        "confidence": round(min(max(confidence, 0.0), 1.0), 2),
        "tokens_used": max(0, tokens_used)
    }


def estimate_tokens(text: str) -> int:
    """I estimate the token count from text length (I assume 1 token ≈ 4 characters)."""
    if not text:
        return 0
    return max(1, len(text) // 4)

