# I am the /analyse-document endpoint. I extract multiple risk items from large blocks of text like reports or PDFs.
import json
import logging
import time
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from services.groq_client import call_groq
from services.ai_cache import get_cached, set_cached
from services.response_builder import build_meta, estimate_tokens

logger = logging.getLogger(__name__)
analyse_document_bp = Blueprint('analyse_document', __name__)


def _load_prompt_template() -> str:
    # I'm loading my document analysis prompt from my prompts directory.
    try:
        with open('prompts/analyse_document_prompt.txt', 'r') as f:
            return f.read()
    except FileNotFoundError:
        logger.error("I couldn't find prompts/analyse_document_prompt.txt.")
        return ""


@analyse_document_bp.route('/analyse-document', methods=['POST'])
def analyse_document():
    """
    I use this endpoint to extract structured risk items from a document.
    """
    data = request.get_json(silent=True)
    if not data or not data.get("text", "").strip():
        return jsonify({"error": "I need a 'text' field to analyse a document."}), 400

    input_text = data["text"].strip()
    
    # I'm checking my cache first to see if I've already analysed this text.
    cached_response = get_cached("analyse_document", input_text)
    if cached_response is not None:
        logger.info("I've served the POST /analyse-document from my Redis cache.")
        return jsonify(cached_response), 200

    template = _load_prompt_template()
    if not template:
        return jsonify({"error": "My prompt template is missing."}), 500

    # Large documents might exceed my context windows, so I'm limiting the input to 15,000 characters for now.
    if len(input_text) > 15000:
        input_text = input_text[:15000] + "... [truncated]"

    prompt = template.replace("{input_text}", input_text)
    messages = [{"role": "user", "content": prompt}]

    logger.info(f"I'm calling Groq for /analyse-document. Input length: {len(input_text)} chars.")
    start_time = time.time()
    raw_response = call_groq(messages, temperature=0.2, max_tokens=2000)
    response_time_ms = (time.time() - start_time) * 1000
    ts = datetime.now(timezone.utc).isoformat()

    if raw_response is None:
        return jsonify({"error": "I failed to analyse the document.", "is_fallback": True}), 200

    try:
        # I'm cleaning up the response from Groq before parsing it as JSON.
        clean = raw_response.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        parsed = json.loads(clean)
        
        response_body = {
            **parsed,
            "generated_at": ts,
            "meta": build_meta(
                response_time_ms=response_time_ms,
                cached=False,
                confidence=0.8,
                tokens_used=estimate_tokens(raw_response)
            )
        }

        # I'm storing the analysis results in my cache.
        set_cached("analyse_document", input_text, response_body)
        return jsonify(response_body), 200

    except Exception as e:
        logger.error(f"I failed to parse the /analyse-document JSON: {e}")
        return jsonify({"error": "The AI response was not valid JSON.", "raw": raw_response[:200]}), 500

