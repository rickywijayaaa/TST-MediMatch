from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import secrets
import string
from typing import Optional
from app.predict import predict_alternative_medicine

app = FastAPI()

# Allowed origins
origins = [
    "http://localhost:5174",
    "http://localhost:5175",  # Development frontend
    "http://localhost:5173",  # Another local frontend port
    "https://medimatch.web.id",  # Production frontend
    "https://www.medimatch.web.id"  # Production frontend with www
]

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Specify allowed origins
    allow_credentials=True,  # Allow credentials (if necessary)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# In-memory database for API keys (replace with actual database in production)
api_keys_db = {}

# Model for generating API key requests
class ApiKeyRequest(BaseModel):
    email: str
    phone: str

# Function to generate a secure API key
def generate_api_key(length: int = 32) -> str:
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

@app.post("/generate-api-key")
async def generate_api_key_endpoint(request: ApiKeyRequest):
    """
    Generate an API key based on user input.
    """
    try:
        # Check if the email already exists in the database
        if request.email in api_keys_db:
            return JSONResponse(
                status_code=400,
                content={"success": False, "detail": "API key already exists for this email."}
            )

        # Generate API key
        api_key = generate_api_key()

        # Store the API key in the database (in-memory for now)
        api_keys_db[request.email] = {
            "api_key": api_key,
            "phone": request.phone
        }

        # Return the generated API key
        return {"success": True, "api_key": api_key}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/api-keys")
async def list_api_keys():
    """
    List all generated API keys (for admin use).
    """
    return {"success": True, "api_keys": api_keys_db}

class MedicineRequest(BaseModel):
    drug_name: str
    top_n: int = 5

@app.post("/recommend")
async def recommend_medicines(request: MedicineRequest):
    """
    Recommend alternative medicines based on the given drug name and top N results.
    """
    try:
        # Call the prediction function
        recommendations = predict_alternative_medicine(request.drug_name, request.top_n)

        # Handle case where no recommendations are found
        if isinstance(recommendations, str):
            return JSONResponse(
                status_code=404,
                content={"success": False, "detail": recommendations}
            )

        # Return successful response
        return {"success": True, "data": recommendations}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/")
async def health_check():
    """
    Health check endpoint to verify the server is running.
    """
    return {"status": "Server is running"}
