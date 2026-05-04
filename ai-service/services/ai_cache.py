# I am the Redis AI response cache.
# I'm using SHA256(endpoint_name + input_text) as my cache key — it's deterministic for identical inputs.
# I've set my TTL to 15 minutes (900 seconds) as per my project specs.
# Every time I hit or miss the cache, I increment my counters in metrics.py.
import os
import hashlib
import json
import logging
import redis
from services.metrics import increment_cache_hit, increment_cache_miss

logger = logging.getLogger(__name__)

# I'm reading my Redis connection URL from my environment variables.
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CACHE_TTL_SECONDS = 900  # 15 minutes per my project spec

# I'm initializing my Redis client here. It's a lazy connection that only connects on first use.
try:
    _redis = redis.from_url(REDIS_URL, decode_responses=True, socket_connect_timeout=3)
    _redis.ping()
    logger.info(f"I've successfully connected to my Redis cache at {REDIS_URL}")
    _redis_available = True
except Exception as e:
    logger.warning(f"I couldn't find Redis at {REDIS_URL}: {e}. I'm disabling the cache for now — all calls will go directly to Groq.")
    _redis = None
    _redis_available = False


def _build_cache_key(endpoint: str, input_text: str) -> str:
    """
    I'm building a deterministic SHA256 cache key from the endpoint name and input text.
    My format is: ai_cache:{sha256_hex[:32]}
    """
    raw = f"{endpoint}:{input_text}"
    sha = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    return f"ai_cache:{sha[:32]}"


def get_cached(endpoint: str, input_text: str) -> dict | None:
    """
    I check my Redis cache for a response. I return the parsed dict if I find it, or None if I don't.
    """
    if not _redis_available or _redis is None:
        return None

    key = _build_cache_key(endpoint, input_text)
    try:
        cached_str = _redis.get(key)
        if cached_str:
            logger.info(f"I found a cache HIT for endpoint '{endpoint}'. My key is {key}.")
            increment_cache_hit()
            cached_data = json.loads(cached_str)
            # I'm marking this as served from cache.
            if "meta" in cached_data:
                cached_data["meta"]["cached"] = True
            else:
                cached_data["meta"] = {"cached": True}
            return cached_data
        else:
            logger.info(f"I hit a cache MISS for endpoint '{endpoint}'. My key was {key}.")
            increment_cache_miss()
            return None
    except Exception as e:
        logger.error(f"My Redis GET failed for key {key}: {e}. I'm treating this as a cache miss.")
        increment_cache_miss()
        return None


def set_cached(endpoint: str, input_text: str, response_data: dict) -> bool:
    """
    I store a response in my Redis cache with a 15-minute TTL.
    """
    if not _redis_available or _redis is None:
        return False

    key = _build_cache_key(endpoint, input_text)
    try:
        _redis.setex(key, CACHE_TTL_SECONDS, json.dumps(response_data))
        logger.info(f"I've successfully set a cache entry for endpoint '{endpoint}'. Key: {key}. TTL: {CACHE_TTL_SECONDS}s.")
        return True
    except Exception as e:
        logger.error(f"My Redis SET failed for key {key}: {e}. I didn't cache the response.")
        return False


def is_cache_available() -> bool:
    """I return True if my Redis cache is reachable."""
    return _redis_available

