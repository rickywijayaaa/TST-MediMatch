from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.predict import predict_alternative_medicine

app = FastAPI()

# Allowed origins
origins = [
    "http://localhost:5174",  # Development frontend
    "http://localhost:5173",  # Another local frontend port
    "https://medimatch.web.id",  # Production frontend
    "https://www.medimatch.web.id",  # Production frontend with www
]

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Specify allowed origins
    allow_credentials=True,  # Allow credentials (if necessary)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
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