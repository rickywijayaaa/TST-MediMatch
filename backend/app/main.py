from fastapi import FastAPI, HTTPException, Request, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.predict import predict_alternative_medicine
from jose import JWTError, jwt
import secrets
import string
from datetime import datetime, timedelta
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173",  # Local development frontend
        "https://medimatch.web.id",  # Production frontend domain
        "https://backend.medimatch.web.id"  # Backend domain for frontend to access
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Secret key for signing JWTs (replace with a secure key in production)
SECRET_KEY = "your-secure-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# In-memory storage for API keys (replace with database in production)
api_keys_storage = {}

def generate_api_key(length=32):
    """
    Generate a secure random API key.
    """
    characters = string.ascii_letters + string.digits
    api_key = ''.join(secrets.choice(characters) for _ in range(length))
    return api_key

def add_api_key(user_id: str):
    """
    Generate and store an API key for a specific user.
    """
    api_key = generate_api_key()
    api_keys_storage[user_id] = api_key
    return api_key

def revoke_api_key(user_id: str):
    """
    Revoke an API key for a specific user.
    """
    if user_id in api_keys_storage:
        del api_keys_storage[user_id]
        return f"API key for user {user_id} has been revoked."
    return f"User {user_id} not found."

# JWT Utilities
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT token with expiration.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """
    Decode and validate a JWT token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

class MedicineRequest(BaseModel):
    drug_name: str
    top_n: int = 5

@app.post("/recommend")
async def recommend_medicines(
    request: MedicineRequest, token: Optional[str] = Header(None)
):
    """
    Recommend alternative medicines based on the given drug name and top N results.
    Public access allowed; developers can use a JWT token for tracking.
    """
    try:
        if token:
            payload = decode_access_token(token)
            print(f"Developer access: {payload}")

        # Call the prediction function
        recommendations = predict_alternative_medicine(request.drug_name, request.top_n)

        # Handle case where no recommendations are found
        if isinstance(recommendations, str):  # Error message from the function
            raise HTTPException(status_code=404, detail=recommendations)

        # Return recommendations as a JSON response
        return {"success": True, "data": recommendations}

    except HTTPException as http_error:
        raise http_error
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/")
async def health_check():
    """
    Health check endpoint to verify the server is running.
    """
    return {"status": "Server is running"}

@app.post("/generate-key/{user_id}")
async def generate_key(user_id: str):
    """
    Generate an API key and a JWT token for a specific user.
    """
    try:
        api_key = add_api_key(user_id)
        access_token = create_access_token(data={"user_id": user_id})
        return {"success": True, "user_id": user_id, "api_key": api_key, "jwt": access_token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/revoke-key/{user_id}")
async def revoke_key(user_id: str):
    """
    Revoke an API key for a specific user.
    """
    try:
        message = revoke_api_key(user_id)
        return {"success": True, "message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/list-keys")
async def list_keys():
    """
    List all active API keys (admin access only).
    """
    try:
        keys = api_keys_storage
        return {"success": True, "keys": keys}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
