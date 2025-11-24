import streamlit as st
import os
import google.generativeai as genai
from typing import List, Dict

# Page configuration
st.set_page_config(
    page_title="LLM Chat Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize Gemini client
@st.cache_resource
def init_gemini_client():
    """Initialize Gemini client with API key from environment or Streamlit secrets"""
    api_key = os.getenv("GEMINI_API_KEY") or st.secrets.get("GEMINI_API_KEY", None)
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    return True

# Get available models
def get_available_models(api_key_hash=None):
    """Get list of available Gemini models"""
    try:
        models = genai.list_models()
        # Filter for models that support generateContent
        available = [m.name.replace("models/", "") for m in models if "generateContent" in m.supported_generation_methods]
        return available if available else ["gemini-pro", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest"]
    except Exception as e:
        # Fallback to known working models
        return ["gemini-pro", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest"]

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages: List[Dict] = []
if "gemini_configured" not in st.session_state:
    st.session_state.gemini_configured = init_gemini_client()

# Sidebar for configuration
with st.sidebar:
    st.title("⚙️ Configuration")

    st.link_button("Back", "http://localhost:5173/")
    
    if st.session_state.gemini_configured:
        st.success("API key loaded from Streamlit secrets.")
    else:
        st.error("Missing `GEMINI_API_KEY` in secrets.toml or environment.")
    
    # Get available models
    if st.session_state.gemini_configured:
        try:
            # Get current API key for cache key
            current_api_key = os.getenv("GEMINI_API_KEY") or st.secrets.get("GEMINI_API_KEY")
            api_key_hash = hash(current_api_key) if current_api_key else None
            model_options = get_available_models(api_key_hash)
        except:
            model_options = ["gemini-pro", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest"]
    else:
        model_options = ["gemini-pro", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest"]
    
    # Model selection - default to gemini-pro as it's most widely available
    default_index = 0
    if "gemini-pro" in model_options:
        default_index = model_options.index("gemini-pro")
    elif len(model_options) > 0:
        default_index = 0
    
    model = st.selectbox(
        "Model",
        model_options,
        index=default_index,
        help="Select the Gemini model to use"
    )
    
    # Temperature slider
    temperature = st.slider(
        "Temperature",
        min_value=0.0,
        max_value=2.0,
        value=0.7,
        step=0.1,
        help="Controls randomness. Lower values make responses more deterministic."
    )
    
    # Max output tokens
    max_output_tokens = st.slider(
        "Max Output Tokens",
        min_value=100,
        max_value=8192,
        value=2048,
        step=100,
        help="Maximum number of tokens in the response"
    )
    
    # Clear chat button
    if st.button("🗑️ Clear Chat", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

# Main chat interface
st.title("🤖 LLM Chat Assistant")
st.markdown("Chat with an AI assistant powered by Google Gemini")

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("Type your message here..."):
    # Add user message to chat
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Check if Gemini is configured
    if not st.session_state.gemini_configured:
        st.error("⚠️ Please configure your Gemini API key in the sidebar to use the chat.")
        st.session_state.messages.pop()  # Remove the message if no API key
    else:
        # Generate assistant response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                try:
                    # Initialize the model
                    gemini_model = genai.GenerativeModel(
                        model_name=model,
                        generation_config={
                            "temperature": temperature,
                            "max_output_tokens": max_output_tokens,
                        }
                    )
                    
                    # Convert messages to Gemini format
                    # Gemini expects alternating user/assistant messages
                    chat_history = []
                    for msg in st.session_state.messages:
                        if msg["role"] == "user":
                            chat_history.append({"role": "user", "parts": [msg["content"]]})
                        elif msg["role"] == "assistant":
                            chat_history.append({"role": "model", "parts": [msg["content"]]})
                    
                    # Start chat with history
                    chat = gemini_model.start_chat(history=chat_history[:-1] if len(chat_history) > 1 else [])
                    
                    # Get the last user message
                    last_user_message = st.session_state.messages[-1]["content"]
                    
                    # Send message and get response
                    response = chat.send_message(last_user_message)
                    assistant_response = response.text
                    
                    st.markdown(assistant_response)
                    
                    # Add assistant response to chat history
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": assistant_response
                    })
                except Exception as e:
                    error_msg = f"❌ Error: {str(e)}"
                    st.error(error_msg)
                    st.session_state.messages.pop()  # Remove user message on error

# Footer
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: gray;'>
        <small>Powered by Google Gemini API | Streamlit</small>
    </div>
    """,
    unsafe_allow_html=True
)

