from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from app.predict import predict_alternative_medicine

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development frontend
        "https://medimatch.web.id",  # Production frontend domain
        "https://backend.medimatch.web.id"  # Backend domain for frontend to access
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        if isinstance(recommendations, str):  # Error message from the function
            raise HTTPException(status_code=404, detail=recommendations)

        # Return recommendations as a JSON response
        return {"success": True, "data": recommendations}

    except HTTPException as http_error:
        # Re-raise HTTP exceptions to keep their status codes
        raise http_error
    except Exception as e:
        # Log the error (for debugging purposes, use a proper logging framework in production)
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/")
async def health_check():
    """
    Health check endpoint to verify the server is running.
    """
    return {"status": "Server is running"}
