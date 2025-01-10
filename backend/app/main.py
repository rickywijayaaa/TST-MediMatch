from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import secrets
import string
from typing import Optional
from app.predict import predict_alternative_medicine
import os
from supabase import create_client, Client
from fastapi import Header, HTTPException, Request
import secrets

app = FastAPI()

# Supabase Config (Replace with your own Supabase URL and Service Key)
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://rjzdghaqnkqdwmgavzmc.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqemRnaGFxbmtxZHdtZ2F2em1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjQ0NTI3NSwiZXhwIjoyMDUyMDIxMjc1fQ.0iP_5LmijElfA5ZdJoqdwH1S4xUWTCew3Jtnfm84Ui0")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


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
    Generate a new API key and save it to the Supabase table without checking for existing records.
    """
    try:
        print(f"Received request: {request.dict()}")

        # Generate a new API key
        api_key = generate_api_key()
        print(f"Generated new API key: {api_key}")

        # Insert the new record into the Supabase table
        response = supabase.table("api_keys").insert({
            "email": request.email,
            "phone": request.phone,
            "api_key": api_key
        }).execute()


        print(f"API key inserted successfully for {request.email}")
        return {"success": True, "api_key": api_key}

    except Exception as e:
        print(f"Error during API key generation: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")






@app.get("/api-keys")
async def list_api_keys():
    """
    List all API keys (admin only).
    """
    try:
        keys = supabase.table("api_keys").select("*").execute()
        return {"success": True, "api_keys": keys.data}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

class MedicineRequest(BaseModel):
    drug_name: str
    top_n: int = 5



@app.post("/recommend")
async def recommend_medicines(
    request: Request,  # Use the Request object to access headers
    body: MedicineRequest,  # The payload body remains a Pydantic model
    api_key: Optional[str] = Header(None),  # Capture the API key from the X-API-Key header
):
    """
    Recommend alternative medicines based on the given drug name and top N results.
    API key required for external developers but not for Medimatch users.
    """
    try:
        # Check if the request is from your Medimatch web app (bypass API key validation)
        referer = request.headers.get("Referer", "")
        if "medimatch.web.id" in referer:
            print("Request from Medimatch web app, bypassing API key validation.")
        else:
            # Validate API key
            if not api_key:
                raise HTTPException(status_code=403, detail="Missing API key")

            # Query Supabase to validate the API key
            response = supabase.table("api_keys").select("*").eq("api_key", api_key).execute()
            if not response.data:
                raise HTTPException(status_code=403, detail="Invalid API key")

            print(f"Valid API key: {api_key}")

        # Call the prediction function
        recommendations = predict_alternative_medicine(body.drug_name, body.top_n)

        # Handle case where no recommendations are found
        if isinstance(recommendations, str):
            return JSONResponse(
                status_code=404,
                content={"success": False, "detail": recommendations}
            )

        # Return successful response
        return {"success": True, "data": recommendations}

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



@app.get("/")
async def health_check():
    """
    Health check endpoint to verify the server is running.
    """
    return {"status": "Server is running"}
