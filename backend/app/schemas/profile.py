from pydantic import BaseModel, Field
from typing import Optional, List
import datetime

class ProfileOut(BaseModel):
    guild_id: str
    user_id: str
    username: str
    avatar_url: Optional[str]
    lifetime_xp: int
    season_xp: int
    level: int
    reputation: int
    streak_days: int
    xp_in_level: int
    xp_for_next_level: int
    badges: List[str] = []

class RepRequest(BaseModel):
    from_user_id: str
    to_user_id: str
    reason: Optional[str] = Field(None, max_length=255)

class RepResultOut(BaseModel):
    success: bool
    to_user_id: str
    new_reputation: int
    message: str
