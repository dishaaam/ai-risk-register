# I am the pytest configuration file. I create a Flask test client and mock Groq and Redis at startup.
import pytest
import sys
import os

# I'm adding the ai-service root to the Python path so my imports work correctly.
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from unittest.mock import patch, MagicMock
from dotenv import load_dotenv

# I'm loading my .env file so that os.getenv calls in my app modules don't fail during testing.
load_dotenv()

@pytest.fixture(scope="session")
def app():
    """I am creating a Flask test application with my AI and cache dependencies mocked."""
    # I'm patching Groq and Redis before the app is imported to ensure my real services aren't called.
    with patch("groq.Groq") as mock_groq_cls, \
         patch("redis.from_url") as mock_redis:

        # I'm configuring my mock Redis to behave as a cache miss by default.
        mock_redis_instance = MagicMock()
        mock_redis_instance.ping.return_value = True
        mock_redis_instance.get.return_value = None
        mock_redis_instance.setex.return_value = True
        mock_redis.return_value = mock_redis_instance

        # Now I import my app after my patches are active.
        from app import create_app
        test_app = create_app()
        test_app.config["TESTING"] = True
        yield test_app

@pytest.fixture(scope="session")
def client(app):
    """I provide a standard Flask test client for all my unit tests."""
    return app.test_client()
