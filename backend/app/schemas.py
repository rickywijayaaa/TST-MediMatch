from pydantic import BaseModel
from typing import List, Dict

class MedicineRequest(BaseModel):
    input_medicine: str

class AlternativeMedicineResponse(BaseModel):
    medicine: str
    similarity_score: float
