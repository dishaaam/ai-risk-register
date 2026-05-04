import os
import json
import time
import logging
from groq import Groq
from dotenv import load_dotenv
from services.metrics import record_response_time

# I'm loading my environment variables first so I can safely read my API key.
load_dotenv()

logger = logging.getLogger(__name__)

# I'm initializing my Groq client carefully. I never put my API key string directly here!
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# I'm pointing to my prompts folder which sits next to the services folder.
PROMPT_DIR = os.path.join(os.path.dirname(__file__), '..', 'prompts')

def load_prompt(key: str) -> str:
    # I use this to dynamically read my prompt text files.
    path = os.path.join(PROMPT_DIR, f'{key}_prompt.txt')
    with open(path) as f:
        return f.read()

def call_groq(prompt_key_or_messages, user_input=None, temperature=0.3, max_tokens=1000, max_retries=3) -> any:
    # I'll determine if I'm being called with a prompt_key or a list of messages.
    if isinstance(prompt_key_or_messages, list):
        messages = prompt_key_or_messages
        # If I receive a list of messages, I assume the caller expects a raw string response.
        is_legacy = False
    else:
        # This is my legacy call mode using a prompt_key and user_input.
        template = load_prompt(prompt_key_or_messages)
        full_prompt = template.replace('{user_input}', user_input)
        messages = [{'role': 'user', 'content': full_prompt}]
        is_legacy = True
    
    # I'm using a 3-retry loop to handle any free tier API hiccups or rate limiting.
    for attempt in range(max_retries):
        try:
            start_ms = time.time() * 1000
            # I must use this exact model! Any typo here will cause a silent error.
            resp = client.chat.completions.create(
                model='llama-3.3-70b-versatile',
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            end_ms = time.time() * 1000
            # I'm recording the response duration for my health metrics.
            record_response_time(end_ms - start_ms)
            raw = resp.choices[0].message.content.strip()
            
            if not is_legacy:
                return raw
                
            # My model sometimes throws in markdown code blocks, so I'll strip them out just to be safe.
            if raw.startswith('```'):
                if '\n' in raw:
                    raw = raw.split('\n', 1)[1]
                if raw.endswith('```'):
                    if '\n' in raw:
                        raw = raw.rsplit('\n', 1)[0]
                    else:
                        raw = raw[:-3]
            
            # I'll remove 'json' if it's present at the start of the string.
            if raw.strip().lower().startswith('json'):
                raw = raw.strip()[4:].strip()
                
            # Now I'll parse the cleaned string into my requested JSON shape.
            return json.loads(raw.strip())
            
        except json.JSONDecodeError as e:
            logger.error(f'I hit a JSON error on attempt {attempt+1}: {e}')
            if attempt == max_retries - 1:
                return None
        except Exception as e:
            logger.error(f'I hit a Groq error on attempt {attempt+1}: {e}')
            if attempt < max_retries - 1:
                # I'm waiting before I retry.
                time.sleep(2 ** attempt)
            else:
                return None
    return None

def stream_groq(messages, temperature=0.4, max_tokens=1000):
    """
    I am a generator for streaming my Groq responses (SSE).
    I yield raw text chunks from my model.
    """
    try:
        stream = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True
        )
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
    except Exception as e:
        logger.error(f"I hit a Groq streaming error: {e}")
        yield " [STREAM ERROR: My AI service was interrupted] "

