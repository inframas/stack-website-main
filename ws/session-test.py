import os
import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create the FastAPI app
app = FastAPI()

# Add CORS middleware with allow_credentials=True
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL
    allow_credentials=True,  # This allows sending cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add session middleware
app.add_middleware(SessionMiddleware, secret_key="testing")

# MongoDB connection using environment variables
mongo_user = os.getenv("MONGO_USER")
mongo_password = os.getenv("MONGO_PASSWORD")
mongo_host = os.getenv("MONGO_HOST")
mongo_port = os.getenv("MONGO_PORT")
mongo_db = os.getenv("MONGO_DB")

# Setup MongoDB connection
mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/?authSource=admin"
client = MongoClient(mongo_uri)
db = client[mongo_db]
users_collection = db['users']

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic model for login and registration data
class LoginData(BaseModel):
    username: str
    password: str

class RegisterData(BaseModel):
    username: str
    password: str
    email: str
    birthdate: str

# Helper function to hash passwords
def hash_password(password: str):
    return pwd_context.hash(password)

# Helper function to verify passwords
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Helper function to authenticate user
def authenticate_user(username: str, password: str):
    user = users_collection.find_one({"username": username})
    if user and verify_password(password, user["password"]):
        return True
    return False

# Helper function to generate a 32-character ID
def generate_user_id():
    return uuid.uuid4().hex

# Home route
@app.get("/")
async def home(request: Request):
    if "user" in request.session:
        return {"message": f"Hello, {request.session['user']}!"}
    return {"message": "You are not logged in. Please log in."}

# Register endpoint
@app.post("/register")
async def register(user_data: RegisterData):
    # Check if the user or email already exists
    if users_collection.find_one({"username": user_data.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if users_collection.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    # Hash the password
    hashed_password = hash_password(user_data.password)

    # Generate a unique user ID
    user_id = generate_user_id()
    created_at = datetime.utcnow()

    # Insert user into MongoDB
    users_collection.insert_one({
        "_id": user_id,
        "username": user_data.username,
        "password": hashed_password,
        "email": user_data.email,
        "birthdate": user_data.birthdate,
        "created_at": created_at
    })

    return {"message": "User registered successfully", "status": 201}

# Login endpoint
@app.post("/login")
async def login(request: Request, login_data: LoginData):
    if authenticate_user(login_data.username, login_data.password):
        request.session['user'] = login_data.username
        return {"message": "Login successful", "status": 200}
    raise HTTPException(status_code=401, detail="Invalid username or password")

# Logout endpoint
@app.get("/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out successfully"}
