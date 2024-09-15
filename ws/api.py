from typing import Optional
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pymongo import MongoClient
from passlib.context import CryptContext
import secrets
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Setup FastAPI app
app = FastAPI()
# app = FastAPI(docs_url=None, redoc_url=None)

SECRET_KEY = os.getenv("SECRET_KEY")
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY, max_age=3600 * 6)

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can allow all origins with ['*']
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

# MongoDB credentials
mongo_user = os.getenv("MONGO_USER")
mongo_password = os.getenv("MONGO_PASSWORD")
mongo_host = os.getenv("MONGO_HOST")
mongo_port = os.getenv("MONGO_PORT")
mongo_db = os.getenv("MONGO_DB")


# Setup MongoDB connection with authentication
mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/?authSource=admin"
client = MongoClient(mongo_uri)
db = client[mongo_db]
users_collection = db['users']

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models
class User(BaseModel):
    username: str
    email: str
    password: str
    birthdate: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    id: str = Field(..., alias="_id")  # Map MongoDB '_id' field to 'id'
    username: str
    hashed_password: str = Field(..., alias="password")  # Map MongoDB 'password' field to 'hashed_password'
    email: Optional[str] = None  # Optional email field
    birthdate: Optional[str] = None  # Optional birthdate field
    created_at: Optional[datetime] = None  # Track when the user was created
    last_login: Optional[datetime] = None  # Track when the user last logged in

class Token(BaseModel):
    username: str
    message: str

# Utility to generate a 24-character user ID
def generate_user_id() -> str:
    return secrets.token_hex(12)  # Generates a 24-character hexadecimal string

# Hash password utility
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify password utility
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Fetch user from MongoDB by username
def get_user(username: str):
    user = users_collection.find_one({"username": username})
    if user:
        return UserInDB(**user)  # Use aliasing in Pydantic
    return None

# Register user route
@app.post("/register", response_model=Token)
def register(user: User):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = hash_password(user.password)
    user_id = generate_user_id()  # Generate a 24-character user ID
    created_at = datetime.utcnow()  # Get the current UTC time for created_at

    # Insert user with custom ID and created_at timestamp into MongoDB
    users_collection.insert_one({
        "_id": user_id,
        "username": user.username,
        "password": hashed_password,
        "email": user.email,
        "birthdate": user.birthdate,
        "created_at": created_at  # Add created_at timestamp
    })

    return {"username": user.username, "message": "User successfully registered"}

# Login route
@app.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = get_user(user.username)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Update the last_login field with the current time
    last_login = datetime.utcnow()
    users_collection.update_one(
        {"username": user.username},
        {"$set": {"last_login": last_login}}
    )

    return {"username": user.username, "message": "Login successful"}
