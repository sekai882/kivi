import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def get_embedding(text: str) -> list[float]:
    result = await genai.embed_content_async(
        model="models/text-embedding-004",
        content=text
    )
    return result['embedding']

async def get_chat_completion(system_prompt: str, user_message: str) -> str:
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_prompt
    )
    response = await model.generate_content_async(user_message)
    return response.text
