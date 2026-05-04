# I am the /categorise endpoint. I classify a risk item into one of 8 predefined categories.
import logging
import time
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from services.groq_client import call_groq
from services.ai_cache import get_cached, set_cached
from services.response_builder import build_meta, estimate_tokens

logger = logging.getLogger(__name__)
categorise_bp = Blueprint('categorise', __name__)

# These are the 8 valid categories I support — I'll reject any response outside this set.
VALID_CATEGORIES = {
    "FINANCIAL", "OPERATIONAL", "TECHNICAL", "COMPLIANCE",
    "REPUTATIONAL", "STRATEGIC", "SECURITY", "ENVIRONMENTAL"
}

# This is the fallback response I use when my Groq service is unavailable or returns something invalid.
FALLBACK_RESPONSE = {
    "category": "OPERATIONAL",
    "confidence": 0.0,
    "reasoning": "I couldn't determine the category because my AI service is unavailable. Manual review required.",
    "is_fallback": True
}

@categorise_bp.route('/categorise', methods=['POST'])
def categorise():
    """
    I classify a risk item into one of my 8 predefined categories.
    """
    # I'm validating my input here.
    data = request.get_json(silent=True)
    if not data:
        logger.warning("I received a POST /categorise request with no JSON body.")
        return jsonify({"error": "I need a JSON request body with a 'text' field."}), 400

    input_text = data.get("text", "").strip()
    if not input_text:
        logger.warning("I received a POST /categorise request with an empty 'text' field.")
        return jsonify({"error": "The 'text' field is required and cannot be empty."}), 400

    if len(input_text) > 5000:
        logger.warning(f"I received a POST /categorise request with input that is too long: {len(input_text)} chars.")
        return jsonify({"error": "The 'text' field must not exceed 5000 characters."}), 400

    # I'm checking my cache first.
    cached_response = get_cached("categorise", input_text)
    if cached_response is not None:
        logger.info("I've served POST /categorise from my Redis cache.")
        return jsonify(cached_response), 200

    logger.info(f"I'm calling my Groq service for /categorise. Input length: {len(input_text)} chars.")
    start_time = time.time()
    # I'm using the 'categorise' key to load my 'prompts/categorise_prompt.txt'.
    result = call_groq('categorise', input_text, temperature=0.1)
    response_time_ms = (time.time() - start_time) * 1000

    ts = datetime.now(timezone.utc).isoformat()

    # I'm handling any Groq failures or invalid JSON responses here.
    if result is None or not isinstance(result, dict):
        logger.error("My Groq service returned None or something invalid for /categorise. I'm returning my fallback.")
        response_body = {
            **FALLBACK_RESPONSE, 
            "generated_at": ts,
            "meta": build_meta(response_time_ms, False, 0.0, 0)
        }
        return jsonify(response_body), 200

    # I'm validating and normalising my response data.
    category = str(result.get("category", "")).upper()
    confidence = float(result.get("confidence", 0.0))
    reasoning = result.get("reasoning", "")

    if category not in VALID_CATEGORIES:
        logger.warning(f"My AI service returned an invalid category '{category}'. I'm defaulting to OPERATIONAL.")
        category = "OPERATIONAL"
        confidence = 0.0

    response_body = {
        "category": category,
        "confidence": round(min(max(confidence, 0.0), 1.0), 2),
        "reasoning": reasoning,
        "generated_at": ts,
        "is_fallback": False,
        "meta": build_meta(
            response_time_ms=response_time_ms,
            cached=False,
            confidence=confidence,
            tokens_used=estimate_tokens(str(result))
        )
    }

    # I'm storing my response in my cache.
    set_cached("categorise", input_text, response_body)

    return jsonify(response_body), 200

