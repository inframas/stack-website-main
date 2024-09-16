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

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can allow all origins with ['*']
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
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




def connect_to_mongo(collection_name):
    """
    Connects to MongoDB using environment variables and returns the database and collections.
    """
    # Load environment variables
    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST")
    mongo_port = os.getenv("MONGO_PORT")
    mongo_db = os.getenv("MONGO_DB")
    
    if not all([mongo_user, mongo_password, mongo_host, mongo_port, mongo_db]):
        raise ValueError("Missing one or more environment variables for MongoDB connection.")

    # Setup MongoDB connection
    mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/?authSource=admin"
    
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Test the connection
        client.admin.command('ping')
        print("Connected to MongoDB successfully!")
    except ConnectionError as e:
        raise ConnectionError(f"Could not connect to MongoDB: {e}")
    
    db = client[mongo_db]
    users_collection = db[collection_name]

    return db, users_collection



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

# Pydantic model for request body
class UserIdRequestUsersCards(BaseModel):
    user_id: str










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

@app.get("/check-session", tags=["Authentication"])
async def home(request: Request):
    if "user" in request.session:
        user = request.session['user']
        # return {
        #     "user_id" : user
        # }
        return user
    return {"message": "You are not logged in. Please log in."}



# Register endpoint
@app.post("/register", tags=["Authentication"])
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
@app.post("/login", tags=["Authentication"])
async def login(request: Request, login_data: LoginData):
    if authenticate_user(login_data.username, login_data.password):
        request.session['user'] = login_data.username

        db, users_collection = connect_to_mongo("users")
        user_data_cards = users_collection.find_one({"username" : login_data.username})

        if user_data_cards:
            user_id = user_data_cards.get("_id")
            request.session['user_id'] = str(user_id)  # Store user_id as string in session
            
            return {"message": "Login successful", "status": 200}
        else:
            raise HTTPException(status_code=401, detail="Invalid username or password")

    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")


    raise HTTPException(status_code=401, detail="Invalid username or password")

# Logout endpoint
@app.get("/logout", tags=["Authentication"])
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out successfully"}









# Logout endpoint
@app.get("/cards/get-all", tags=["Cards"])
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out successfully"}

@app.get("/cards/get-one", tags=["Cards"])
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out successfully"}


def test_mongo_query():
    db, users_collection = connect_to_mongo()
    
    # Perform a simple query - Get the first user
    user = users_collection.find_one()  # You can specify a filter if needed, e.g., {"username": "test"}
    
    if user:
        print("User found:", user)
    else:
        print("No users found.")


@app.post("/cards/get-user-card-all", tags=["Cards"])
async def get_user_cards(body: UserIdRequestUsersCards):
    user_id = body.user_id
    
    db, users_collection = connect_to_mongo("users-cards")
    user_data_cards = users_collection.find({"users_id" : user_id})
    
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    if not user_data_cards:
        return {"message": "No cards found for the given user_id", "user_id": user_id}

    card_list = []

    if user_data_cards:
        for data_one_card in user_data_cards:
            card_list.append(data_one_card)

    return card_list

@app.get("/cards/get-user-card-one", tags=["Cards"])
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out successfully"}