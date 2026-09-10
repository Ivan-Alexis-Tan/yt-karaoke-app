from dotenv import load_dotenv
from pathlib import Path
import os

current_path = Path(__file__).resolve().parents[2]
env_path = current_path / ".env"

load_dotenv(env_path)

DATABASE_URL = os.getenv("LOCAL_DATABASE_URL")
API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_URL = "https://www.googleapis.com/youtube/v3"


