# I am the /recommend endpoint.
from flask import Blueprint, request, jsonify
from services.groq_client import call_groq
from services.ai_cache import get_cached, set_cached
from services.response_builder import build_meta, estimate_tokens
from datetime import datetime, timezone
import logging
import time

recommend_bp = Blueprint('recommend', __name__)
logger = logging.getLogger(__name__)

# I've defined this fallback list in case my AI service fails to provide recommendations.
FALLBACK_LIST = [
    {
        "action_type": "Mitigate",
        "description": "Fallback: Review the risk details manually and apply standard mitigation procedures.",
        "priority": "medium"
    },
    {
        "action_type": "Accept",
        "description": "Fallback: Acknowledge the risk temporarily until the system recovers.",
        "priority": "low"
    },
    {
        "action_type": "Avoid",
        "description": "Fallback: Escalate to management to prevent further exposure.",
        "priority": "high"
    }
]

@recommend_bp.route('/recommend', methods=['POST'])
def recommend():
    # I'm handling the recommendation request here.
    data = request.get_json(silent=True)
    if not data or not data.get('text', '').strip():
        return jsonify({'error': 'The "text" field is required.'}), 400
    
    input_text = data['text'].strip()

    # I'm checking my cache first.
    cached_response = get_cached("recommend", input_text)
    if cached_response is not None:
        logger.info("I've served POST /recommend from my Redis cache.")
        return jsonify(cached_response), 200

    # I hit a cache miss, so I'm calling Groq now.
    start_time = time.time()
    # I'm calling Groq with temperature 0.5 for slightly creative recommendations!
    result = call_groq('recommend', input_text, temperature=0.5)
    response_time_ms = (time.time() - start_time) * 1000
    ts = datetime.now(timezone.utc).isoformat()
    
    # I'm falling back gracefully if the API fails or doesn't return a list.
    if result is None or not isinstance(result, list):
        logger.warning('My Groq call failed or returned a non-list for /recommend. I\'m returning my fallback.')
        response_body = {
            'recommendations': FALLBACK_LIST,
            'is_fallback': True,
            'generated_at': ts,
            'meta': build_meta(response_time_ms, False, 0.0, 0)
        }
        return jsonify(response_body), 200
        
    response_body = {
        'recommendations': result[:3],
        'is_fallback': False,
        'generated_at': ts,
        'meta': build_meta(
            response_time_ms=response_time_ms,
            cached=False,
            confidence=0.85,
            tokens_used=estimate_tokens(str(result))
        )
    }

    # I'm storing the result in my cache.
    set_cached("recommend", input_text, response_body)

    return jsonify(response_body), 200

