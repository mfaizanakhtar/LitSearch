# main.py
from db.database import database_setup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import user_router
from routers import paper_router

load_dotenv()  # Load environment variables

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    database_setup()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(user_router.router, prefix="/api/users")
app.include_router(paper_router.router, prefix="/api/paper")

# ... rest of your FastAPI app
