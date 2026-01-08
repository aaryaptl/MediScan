from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from models import User, Login
from database import db
import jwt, os
from datetime import datetime, timedelta

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET = os.getenv("JWT_SECRET", "SUPERSECRET")

users = db["users"]

def create_token(data):
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")

@router.post("/signup")
def signup(user: User):
    print("SIGNUP CALLED FOR:", user.email)

    existing = users.find_one({"email": user.email})
    if existing:
        print("USER ALREADY EXISTS")
        raise HTTPException(400, "Email already exists")

    users.insert_one({
        "name": user.name,
        "email": user.email,
        "password": pwd.hash(user.password)
    })

    print("USER INSERTED")

    token = create_token({"email": user.email})
    return {"token": token}

@router.post("/login")
def login(body: Login):
    user = users.find_one({"email": body.email})
    if not user or not pwd.verify(body.password, user["password"]):
        raise HTTPException(400, "Invalid credentials")

    token = create_token({"email": body.email})
    return {"token": token}
