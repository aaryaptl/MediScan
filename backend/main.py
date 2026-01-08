from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_routes
from database import db
from ocr_pipeline import MedicalPipeline
import shutil, os, jwt
from bson import ObjectId
from datetime import datetime

app = FastAPI()
pipeline = MedicalPipeline()
reports = db["reports"]
SECRET = "SUPERSECRET"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_methods=["*"]
)

app.include_router(auth_routes, prefix="/auth")

def auth_user(token):
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])
    except:
        raise HTTPException(401, "Invalid token")

import uuid

@app.post("/upload")
def upload(file: UploadFile = File(...), token: str = ""):
    user = auth_user(token)
    
    # Create unique temp filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid.uuid4()}{file_ext}"
    path = f"temp/{unique_name}"
    
    os.makedirs("temp", exist_ok=True)
    
    try:
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = pipeline.run(path)

        reports.insert_one({
            "email": user["email"],
            "file": file.filename, # Keep original name for display
            "result": result,
            "createdAt": datetime.now().isoformat()
        })

        return result
    finally:
        # cleanup
        if os.path.exists(path):
            os.remove(path)

@app.get("/history")
def history(token: str = ""):
    user = auth_user(token)
    items = list(reports.find({"email": user["email"]}).sort("_id", -1))
    for i in items:
        i["_id"] = str(i["_id"])
    return items

@app.get("/report/{id}")
def get_report(id: str, token: str = ""):
    user = auth_user(token)
    report = reports.find_one({"_id": ObjectId(id), "email": user["email"]})
    if not report:
        raise HTTPException(404, "Report not found")
    report["_id"] = str(report["_id"])
    return report

@app.delete("/report/{id}")
def delete_report(id: str, token: str = ""):
    user = auth_user(token)
    result = reports.delete_one({"_id": ObjectId(id), "email": user["email"]})
    if result.deleted_count == 0:
        raise HTTPException(404, "Report not found")
    return {"message": "Report deleted"}

@app.delete("/history")
def clear_history(token: str = ""):
    user = auth_user(token)
    reports.delete_many({"email": user["email"]})
    return {"message": "History cleared"}