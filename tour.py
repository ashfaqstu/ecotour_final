import requests
import os

api_key = os.environ.get("GROQ_API_KEY", "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")

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "model": "openai/gpt-oss-20b",
    "messages": [
        {
            "role": "user",
            "content": "Explain the importance of fast language models"
        }
    ]
}

response = requests.post(
    "https://api.groq.com/openai/v1/chat/completions",
    headers=headers,
    json=data
)

result = response.json()
print(result)
