import os
import logging
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# I am importing all my blueprints here.
from routes.describe import describe_bp
from routes.recommend import recommend_bp
from routes.generate_report import generate_report_bp
from routes.categorise import categorise_bp
from routes.query import query_bp
from routes.health import health_bp
from routes.analyse_document import analyse_document_bp
from services.chroma_client import get_model
from services.sanitiser import sanitise_text
from services.ingest_documents import ingest_document

# I'm calling load_dotenv() at the very top to ensure my environment variables are ready.
load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# I'm setting up my rate limiter. I've defaulted it to 30 requests per minute.
limiter = Limiter(
    get_remote_address,
    default_limits=['30 per minute']
)

def create_app():
    # I'm initializing my Flask application here.
    app = Flask(__name__)
    
    # I'm hooking my limiter into the app.
    limiter.init_app(app)
    
    # I'm registering all my blueprints so my endpoints are active.
    app.register_blueprint(describe_bp)
    app.register_blueprint(recommend_bp)
    app.register_blueprint(generate_report_bp)
    app.register_blueprint(categorise_bp)
    app.register_blueprint(query_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(analyse_document_bp)

    # I've exempted my health endpoint from rate limiting so I can always monitor it.
    limiter.exempt(health_bp)

    # I've applied a tighter limit of 10 requests per minute to my report generator to manage token costs.
    limiter.limit("10 per minute")(generate_report_bp)
    logger.info("I've registered my generate_report blueprint with a 10 req/min limit.")

    # I've added a global hook to sanitise all my incoming JSON inputs.
    @app.before_request
    def sanitise_all_inputs():
        if request.method in ('POST', 'PUT'):
            data = request.get_json(silent=True)
            if not data:
                return
            
            def check_for_injection(obj):
                if isinstance(obj, str):
                    cleaned, is_injection = sanitise_text(obj)
                    if is_injection:
                        return True
                elif isinstance(obj, list):
                    for item in obj:
                        if check_for_injection(item):
                            return True
                elif isinstance(obj, dict):
                    for val in obj.values():
                        if check_for_injection(val):
                            return True
                return False

            if check_for_injection(data):
                return jsonify({
                    "error": "I detected invalid input. I've blocked this request.",
                    "code": "INJECTION_DETECTED"
                }), 400
    
    # I'm pre-loading my SentenceTransformer model at startup so my users don't face a slow first request.
    get_model()
    

    @app.route('/ingest', methods=['POST'])
    def ingest():
        """
        I use this endpoint to ingest documents into my ChromaDB vector store.
        """
        data = request.get_json(silent=True)
        if not data or not data.get('text'):
            return jsonify({"error": "I need a 'text' field to perform ingestion."}), 400
        
        text = data['text']
        source = data.get('source', 'unknown_source')
        
        try:
            ingest_document(text, source)
            return jsonify({"message": "I've successfully ingested your document.", "status": "success"}), 201
        except Exception as e:
            logger.error(f"My ingestion process failed: {e}")
            return jsonify({"error": str(e)}), 500
        
    return app

if __name__ == '__main__':
    app = create_app()
    # I'm running with threaded=True so I can handle multiple concurrent requests from my Java backend.
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)

