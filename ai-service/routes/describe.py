# I am the /describe endpoint.
from flask import Blueprint, request, jsonify
from services.groq_client import call_groq
from services.ai_cache import get_cached, set_cached
from services.response_builder import build_meta, estimate_tokens
from datetime import datetime, timezone
import logging
import time

describe_bp = Blueprint('describe', __name__)
logger = logging.getLogger(__name__)

# I've defined this fallback description in case my AI analysis is temporarily unavailable.
FALLBACK = {
    'title': 'Risk Description Unavailable',
    'description': 'AI analysis temporarily unavailable.',
    'impact': 'Unknown — manual review required.',
    'likelihood': 'unknown', 'category': 'Operational',
    'recommended_owner': 'Risk Manager', 'is_fallback': True
}

@describe_bp.route('/describe', methods=['POST'])
def describe():
    logger.info("I've received a request at /describe.")
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error':'I need a valid JSON request body.'}), 400
        
    text = data.get('text','').strip()
    if not text:
        return jsonify({'error': 'The "text" field is required.'}), 400
        
    if len(text) < 10:
        return jsonify({'error': 'Your input is too short (I need at least 10 characters).'}), 400
        
    if len(text) > 3000:
        return jsonify({'error': 'Your input is too long (max 3000 characters).'}), 400

    # I'm checking my cache first before calling Groq.
    cached_response = get_cached("describe", text)
    if cached_response is not None:
        logger.info("I've served POST /describe from my Redis cache.")
        return jsonify(cached_response), 200

    # I hit a cache miss, so I'm calling Groq now.
    start_time = time.time()
    result = call_groq('describe', text)
    response_time_ms = (time.time() - start_time) * 1000
    ts = datetime.now(timezone.utc).isoformat()
    
    if result is None:
        logger.warning('My Groq call failed. I\'m returning my fallback response.')
        response_body = {
            **FALLBACK, 
            'generated_at': ts,
            'meta': build_meta(response_time_ms, False, 0.0, 0)
        }
        return jsonify(response_body), 200
        
    response_body = {
        **result, 
        'generated_at': ts,
        'is_fallback': False,
        'meta': build_meta(
            response_time_ms=response_time_ms,
            cached=False,
            confidence=0.85,
            tokens_used=estimate_tokens(str(result))
        )
    }

    # I'm storing the result in my cache before I return it.
    set_cached("describe", text, response_body)
        
    return jsonify(response_body), 200

