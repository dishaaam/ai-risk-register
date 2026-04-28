import os
from flask import Flask
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# I am importing my blueprints here
from routes.describe import describe_bp
from routes.recommend import recommend_bp
from routes.generate_report import generate_report_bp
from services.chroma_client import get_model

# I need to ensure load_dotenv() is called at the very top before any os.getenv() calls
load_dotenv()

def create_app():
    # Setting up the Flask application instance
    app = Flask(__name__)
    
    # I am setting up the limiter to restrict the number of requests to 30 per minute, backed by Redis
    limiter = Limiter(
        get_remote_address, app=app,
        default_limits=['30 per minute'],
        # Commenting out Redis for local dev since Docker isn't running!
        # storage_uri=os.getenv('REDIS_URL', 'redis://localhost:6379')
    )
    
    # Registering my blueprints so the routes are available
    app.register_blueprint(describe_bp)
    app.register_blueprint(recommend_bp)
    app.register_blueprint(generate_report_bp)
    
    # I am pre-loading the SentenceTransformer model at startup so the first request isn't terribly slow!
    get_model()
    
    @app.route('/health')
    def health():
        # A simple health check to tell if my service is running correctly
        return {'status': 'ok'}, 200
        
    return app

if __name__ == '__main__':
    app = create_app()
    # threaded=True allows Flask to handle multiple concurrent requests from the Java backend
    # In Docker/production, gunicorn handles this instead (see Dockerfile CMD)
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
