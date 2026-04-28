# I'm using the official Python 3.11 slim image for a smaller footprint
FROM python:3.11-slim

WORKDIR /app

# I'm installing my dependencies first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now I'll copy the rest of my application code
COPY . .

# Expose port 5000 which is what my Flask app runs on
EXPOSE 5000

# Using gunicorn as the production WSGI server to handle concurrent requests from the Java backend.
# 4 workers means 4 requests can be processed simultaneously without blocking each other.
CMD ["gunicorn", "--workers=4", "--bind=0.0.0.0:5000", "--timeout=120", "app:create_app()"]
