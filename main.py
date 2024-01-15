from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import backend.routers.users as users
import backend.routers.papers as papers

load_dotenv()  # Load environment variables

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(users.router, prefix="/api/users")
app.include_router(papers.router, prefix="/api/paper")