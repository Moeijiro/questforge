from fastapi import APIRouter
from app.api.v1.endpoints import quests, profiles, leaderboards, demo

api_router = APIRouter()

api_router.include_router(quests.router, prefix="/quests", tags=["quests"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(leaderboards.router, prefix="/leaderboards", tags=["leaderboards"])
api_router.include_router(demo.router, prefix="/demo", tags=["demo"])
