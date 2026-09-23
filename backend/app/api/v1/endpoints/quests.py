import json
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List

from app.db.session import get_db
from app.db.models import Quest, QuestProgress
from app.schemas.quest import QuestCreate, QuestOut, QuestProgressOut
from app.services.quest_engine import process_quest_event

router = APIRouter()

@router.get("/{guild_id}", response_model=List[QuestOut])
async def list_quests(
    guild_id: str,
    category: str = Query("all"),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Quest).where(and_(Quest.guild_id == guild_id, Quest.is_active == True))
    if category != "all":
        stmt = stmt.where(Quest.category == category)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/{guild_id}", response_model=QuestOut, status_code=status.HTTP_201_CREATED)
async def create_quest(guild_id: str, payload: QuestCreate, db: AsyncSession = Depends(get_db)):
    quest = Quest(
        guild_id=guild_id,
        title=payload.title,
        description=payload.description,
        trigger_type=payload.trigger_type,
        category=payload.category,
        target_value=payload.target_value,
        reward_xp=payload.reward_xp,
        reward_role_id=payload.reward_role_id,
        reward_role_name=payload.reward_role_name,
        reward_badge_name=payload.reward_badge_name,
        is_repeatable=payload.is_repeatable,
        is_active=True
    )
    db.add(quest)
    await db.commit()
    await db.refresh(quest)
    return quest

@router.post("/{guild_id}/event")
async def trigger_event(
    guild_id: str,
    user_id: str,
    event_type: str,
    value: int = 1,
    db: AsyncSession = Depends(get_db)
):
    rewards = await process_quest_event(guild_id, user_id, event_type, value, db)
    return {"message": "Event processed", "rewards_unlocked": rewards}
