import os
import json
from django.conf import settings

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    # For more robust JSON parsing, PydanticOutputParser could be used
    # from langchain_core.pydantic_v1 import BaseModel, Field
    # from langchain_core.output_parsers import PydanticOutputParser

    GENAI_SDK_AVAILABLE = True
except ImportError:
    print("WARNING: Langchain or langchain_google_genai not installed. GenAI service via Langchain will not be available.")
    GENAI_SDK_AVAILABLE = False
    # Mock classes if needed for environments where SDK might not be installed
    class ChatGoogleGenerativeAI:
        def __init__(self, model_name=None, temperature=None, convert_system_message_to_human=False, api_key=None): pass
        def invoke(self, Srt): return None # Simplified mock
    class ChatPromptTemplate:
        @staticmethod
        def from_template(template): return None
        @staticmethod
        def from_messages(messages): return None # Added for completeness
    class StrOutputParser:
        def __init__(self): pass


# Langchain configuration happens implicitly when ChatGoogleGenerativeAI is initialized
# as it reads GOOGLE_API_KEY from environment or takes it as a parameter.
# The API key is set in settings from GENAI_API_KEY.

# Optional: Define a Pydantic model for structured output (more robust JSON)
# class LessonSchema(BaseModel):
#     week: int = Field(description="The week number for the lesson")
#     target_phonemes: list[str] = Field(description="List of target phonemes, e.g., ['/s/', '/z/']")
#     words: list[str] = Field(description="List of 5-10 words focusing on target phonemes")
#     story: str = Field(description="A short, engaging story (2-4 sentences) using the words and phonemes")
#     activity: str = Field(description="A simple, interactive activity related to the story and words")


def generate_lesson_with_genai(child_age: int, child_native_language: str, last_assessment_data: dict = None) -> dict | None:
    """
    Generates a lesson plan JSON using LangChain with Google GenAI (Gemini).

    Args:
        child_age: Age of the child.
        child_native_language: Native language of the child.
        last_assessment_data: Optional dictionary of the last assessment.

    Returns:
        A dictionary containing the lesson content if successful, None otherwise.
    """
    if not GENAI_SDK_AVAILABLE:
        print("Langchain SDKs not available. Cannot generate lesson via Langchain.")
        return None

    genai_api_key = getattr(settings, 'GENAI_API_KEY', None)
    model_name = getattr(settings, 'GENAI_MODEL_NAME', 'gemini-1.5-flash-latest')

    if not genai_api_key:
        print("CRITICAL: GENAI_API_KEY is not set in Django settings. Langchain GenAI service will be non-functional.")
        return None
    if not model_name:
        print("CRITICAL: GENAI_MODEL_NAME not set in Django settings.")
        return None

    try:
        # Initialize the ChatGoogleGenerativeAI model
        # Note: LangChain's ChatGoogleGenerativeAI handles GOOGLE_API_KEY from env by default,
        # or it can be passed as `google_api_key` argument.
        # We are relying on it being set in the environment via settings.GENAI_API_KEY for the direct SDK,
        # so LangChain should pick it up if os.environ['GOOGLE_API_KEY'] is set.
        # Alternatively, pass it directly: google_api_key=genai_api_key
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            temperature=0.7,
            convert_system_message_to_human=True, # Good practice for some models
            google_api_key=genai_api_key # Explicitly pass the API key
        )

        # Define the prompt template
        # System message can guide the AI's persona and output format.
        # Human message takes the dynamic input.
        prompt_template_str = """
        System: You are an expert in early childhood language learning and phonics.
        Your goal is to generate a JSON lesson plan for a child.
        The JSON schema MUST be:
        {{
            "week": integer (sequential number for the lesson, e.g., 1, 2, 3),
            "target_phonemes": ["string"], (e.g., ["/s/", "/z/"])
            "words": ["string"], (list of 5-10 words focusing on target phonemes)
            "story": "string", (a short, engaging story of 2-4 sentences incorporating the words and phonemes)
            "activity": "string" (a simple, interactive activity related to the story and words)
        }}
        Ensure the content is simple, engaging, and age-appropriate for the child described below.
        Select appropriate target phonemes that are common challenges or foundational, considering the child's native language.
        Provide ONLY the JSON object as your response, without any surrounding text or markdown.

        Human: Generate a lesson plan for a child who is {child_age} years old
        and whose native language is {child_native_language}.
        Consider the following recent assessment data if available (otherwise, generate a beginner/foundational lesson):
        Last Assessment: {last_assessment_str}
        """

        prompt = ChatPromptTemplate.from_template(prompt_template_str)

        # Using StrOutputParser. If more robust JSON is needed, PydanticOutputParser is better.
        # parser = PydanticOutputParser(pydantic_object=LessonSchema)
        # chain = prompt | llm | parser
        chain = prompt | llm | StrOutputParser()

        last_assessment_str = json.dumps(last_assessment_data) if last_assessment_data else "No recent assessment data. Generate a foundational lesson."

        # Invoke the chain
        response_str = chain.invoke({
            "child_age": child_age,
            "child_native_language": child_native_language,
            "last_assessment_str": last_assessment_str
        })

        # Debug: Print raw response from LLM (string output from StrOutputParser)
        # print(f"Raw Langchain LLM Response (str): {response_str}")

        try:
            # Attempt to parse the string response as JSON
            # It's common for LLMs to sometimes include ```json ... ``` or other text.
            # A more robust parsing might be needed here in a production system.
            cleaned_response_str = response_str.strip()
            if cleaned_response_str.startswith("```json"):
                cleaned_response_str = cleaned_response_str[7:]
            if cleaned_response_str.endswith("```"):
                cleaned_response_str = cleaned_response_str[:-3]

            lesson_data = json.loads(cleaned_response_str.strip())
            return lesson_data
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from Langchain GenAI response: {e}")
            print(f"Received string: {response_str}")
            return None

    except Exception as e:
        print(f"Error during Langchain GenAI lesson generation: {e}")
        # import traceback; traceback.print_exc() # For detailed stack trace
        return None

# Example usage (for testing this module directly, requires .env and Django settings)
# if __name__ == '__main__':
#     # This requires Django settings to be configured, especially GENAI_API_KEY and GENAI_MODEL_NAME
#     # You might need to run this via `python manage.py shell` and then import and run.
#     # from django.conf import settings
#     # settings.configure(...) # If not running in full Django context
#     # os.environ['DJANGO_SETTINGS_MODULE'] = 'lle_backend.settings'
#     # import django
#     # django.setup()

#     if GENAI_SDK_AVAILABLE and settings.GENAI_API_KEY:
#         pass
#         print(f"Using Langchain with GenAI model: {settings.GENAI_MODEL_NAME}")
#         lesson = generate_lesson_with_genai(child_age=5, child_native_language="en", last_assessment_data={"score": 75})
#         if lesson:
#             print("\nGenerated Lesson (Langchain):")
#             print(json.dumps(lesson, indent=2))
#         else:
#             print("Failed to generate lesson using Langchain.")
#     else:
#         print("Skipping genai_service.py Langchain test: SDK not available or API key not set.")
