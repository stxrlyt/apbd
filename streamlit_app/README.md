# Streamlit LLM Chat Assistant

A Streamlit application with an embedded LLM (Large Language Model) for interactive chat conversations powered by Google Gemini.

## Features

- 🤖 Interactive chat interface with Google Gemini models
- ⚙️ Configurable model settings (temperature, max output tokens)
- 🔐 Secure API key management
- 💬 Chat history persistence during session
- 🎨 Clean and modern UI

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Get your Gemini API key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get your free API key
   - Or use [Google Cloud Console](https://console.cloud.google.com/) to create an API key

3. **Set up your Gemini API key:**
   
   Option 1: Environment variable
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```
   
   Option 2: Streamlit secrets (create `.streamlit/secrets.toml`):
   ```toml
   GEMINI_API_KEY = "your-api-key-here"
   ```
   
   Option 3: Enter it directly in the sidebar when running the app

4. **Run the application:**
   ```bash
   streamlit run app.py
   ```

## Usage

1. Start the app using `streamlit run app.py`
2. Configure your API key in the sidebar (if not set as environment variable)
3. Select your preferred model and adjust settings
4. Start chatting with the AI assistant!

## Configuration

- **Model**: The app will automatically detect available models. Common options include:
  - `gemini-1.5-pro-latest` - Most capable model for complex tasks
  - `gemini-1.5-flash-latest` - Fast and efficient
  - `gemini-pro` - Standard model (most widely available)
- **Temperature**: Controls response randomness (0.0 = deterministic, 2.0 = creative)
- **Max Output Tokens**: Maximum length of the AI's response (up to 8192)

## Notes

- Chat history is maintained during the session but cleared when you refresh the page
- API key can be set via environment variable, Streamlit secrets, or sidebar input
- Gemini API has generous free tier limits - check [Google AI Studio](https://makersuite.google.com/) for current limits

