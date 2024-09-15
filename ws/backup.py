from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware with allow_credentials=True
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,  # This allows sending cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key for session
app.add_middleware(SessionMiddleware, secret_key="testing")

# Mock database
users_db = {
    "user1": {
        "username": "user1",
        "password": "password1"
    }
}

# Pydantic model for login data
class LoginData(BaseModel):
    username: str
    password: str

def authenticate_user(username: str, password: str):
    user = users_db.get(username)
    if user and user["password"] == password:
        return True
    return False

@app.get("/")
async def home(request: Request):
    if "user" in request.session:
        return {"message": f"Hello, {request.session['user']}!"}
    return {"message": "You are not logged in. Please log in."}

@app.post("/login")
async def login(request: Request, login_data: LoginData):
    if authenticate_user(login_data.username, login_data.password):
        request.session['user'] = login_data.username
        return {"message": "Login successful", "status": 200}
    raise HTTPException(status_code=401, detail="Invalid username or password")

@app.get("/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return {"message": "Logged out successfully"}

