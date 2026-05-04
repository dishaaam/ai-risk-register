# I am a thread-safe in-memory metrics collector for my AI service.
# I store my response times in a fixed-size deque (last 10 calls).
# My cache hit/miss counters accumulate for the lifetime of this process.
import time
import threading
from collections import deque

_lock = threading.Lock()

# I store the last 10 Groq response times in milliseconds here.
_response_times_ms: deque = deque(maxlen=10)

# These are my cache counters.
_cache_hits: int = 0
_cache_misses: int = 0

# I'm tracking my service start time here.
_start_time: float = time.time()


def record_response_time(duration_ms: float) -> None:
    """I use this to record a Groq API response time in milliseconds."""
    with _lock:
        _response_times_ms.append(round(duration_ms, 1))


def increment_cache_hit() -> None:
    """I increment my cache hit counter by 1."""
    global _cache_hits
    with _lock:
        _cache_hits += 1


def increment_cache_miss() -> None:
    """I increment my cache miss counter by 1."""
    global _cache_misses
    with _lock:
        _cache_misses += 1


def get_avg_response_time_ms() -> float:
    """I return the average of my last 10 Groq response times."""
    with _lock:
        if not _response_times_ms:
            return 0.0
        return round(sum(_response_times_ms) / len(_response_times_ms), 1)


def get_cache_stats() -> dict:
    """I return my current cache hit and miss counts."""
    with _lock:
        return {"hits": _cache_hits, "misses": _cache_misses}


def get_uptime_seconds() -> int:
    """I return the seconds since my service started."""
    return int(time.time() - _start_time)

