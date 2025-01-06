from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from app.predict import predict_alternative_medicine

app = FastAPI()

class MedicineRequest(BaseModel):
    drug_name: str
    top_n: int = 5

@app.post("/recommend")
async def recommend_medicines(request: MedicineRequest):
    try:
        # Call the prediction function
        recommendations = predict_alternative_medicine(request.drug_name, request.top_n)
        
        # Handle case where no recommendations are found
        if isinstance(recommendations, str):  # Error message from the function
            raise HTTPException(status_code=404, detail=recommendations)

        # Return recommendations as a JSON response
        return recommendations

    except Exception as e:
        # Log the error (optional: you can use proper logging here)
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Medicine is not valid")
