from fastapi import FastAPI, HTTPException, Request, APIRouter
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
import httpx
from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles



app = FastAPI()
router = APIRouter()

# Define the request schema for the local endpoint
class ReservationRequest(BaseModel):
    seat_number: str
    reservation_date: str

# Define the response schema (if needed)
class ReservationResponse(BaseModel):
    success: bool
    message: str
    data: Any

# The external API endpoint
EXTERNAL_API_URL = "https://coworkingspace.up.railway.app/api/secure/reservations"
EXTERNAL_API_KEY = "fbc95f8588c50901aa95b850268b5d1632ca318768034fd7f72a50c57a4af785"
EXTERNAL_AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmaXJzYSIsImV4cCI6MTc2ODA0NDgwMH0.saIjnJQPtNxGopy-cLuTKfotHLnDd8J33DEDiOyc2r0"



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



@app.post("/reservation")
async def create_reservation(reservation: ReservationRequest):
    """
    Proxies a reservation request to the external API.
    """
    # Prepare headers for the external API
    headers = {
        "Authorization": EXTERNAL_AUTH_TOKEN,
        "X-API-KEY": EXTERNAL_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient() as client:
            # Forward the request to the external API
            response = await client.post(EXTERNAL_API_URL, json=reservation.dict(), headers=headers)
            
            # Raise error for non-successful responses
            response.raise_for_status()

            # Return the external API response directly to the client
            return response.json()
    except httpx.HTTPStatusError as e:
        # Handle HTTP errors from the external API
        raise HTTPException(status_code=e.response.status_code, detail=e.response.json())
    except Exception as e:
        # Handle generic errors
        raise HTTPException(status_code=500, detail=f"Failed to create reservation: {str(e)}")


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


# Define the payment endpoint
@app.post("/payment")
async def create_payment():
    try:
        # Define the payload and headers
        payload = {
            "currency": "SOL",
            "amount": 0.03,
        }
        headers = {
            "x-api-key": "5fcd48e0-c8b2-455f-ba5e-2f41a9b3e534",  # API Key
        }

        # Call the external API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api-staging.solstra.fi/service/pay/create",
                json=payload,
                headers=headers,
            )

        # Handle response errors
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error from external API: {response.json()}",
            )

        # Return the response to the client
        return {
            "status": response.json().get("status"),
            "message": response.json().get("message"),
            "paymentData": response.json().get("data"),
        }

    except Exception as e:
        # Handle errors
        raise HTTPException(status_code=500, detail=f"Failed to create payment: {str(e)}")





from fastapi.openapi.utils import get_openapi
from fastapi.responses import HTMLResponse
import json


# Mount the static files directory
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
async def serve_documentation():
    """
    Serve the documentation.html file as the default route.
    """
    doc_file_path = os.path.join(STATIC_DIR, "documentation.html")
    if os.path.exists(doc_file_path):
        return FileResponse(doc_file_path)
    raise HTTPException(status_code=404, detail="Documentation file not found")