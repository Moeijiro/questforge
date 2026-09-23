from pydantic import BaseModel, Field
from typing import Optional
import datetime

class QuestCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=2)
    trigger_type: str = Field(..., description="message, reaction, voice, reputation, manual")
    category: str = Field("daily", description="daily, weekly, seasonal, permanent, event")
    target_value: int = Field(1, ge=1)
    reward_xp: int = Field(100, ge=10)
    reward_role_id: Optional[str] = None
    reward_role_name: Optional[str] = None
    reward_badge_name: Optional[str] = None
    is_repeatable: bool = False

class QuestOut(BaseModel):
    id: int
    guild_id: str
    title: str
    description: str
    trigger_type: str
    category: str
    target_value: int
    reward_xp: int
    reward_role_id: Optional[str]
    reward_role_name: Optional[str]
    reward_badge_name: Optional[str]
    is_repeatable: bool
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class QuestProgressOut(BaseModel):
    quest: QuestOut
    current_value: int
    target_value: int
    is_completed: bool
    percentage: int
