from pydantic import BaseModel
from typing import List, Optional

class LeaderboardEntryOut(BaseModel):
    rank: int
    user_id: str
    username: str
    avatar_url: Optional[str]
    level: int
    lifetime_xp: int
    season_xp: int
    reputation: int
    streak_days: int

class LeaderboardResponse(BaseModel):
    guild_id: str
    filter_type: str  # lifetime, season, reputation
    entries: List[LeaderboardEntryOut]
