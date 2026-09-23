import json
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List

from app.db.session import get_db
from app.db.models import MemberProfile, Quest, QuestProgress
from app.schemas.quest import EventType, QuestCreate, QuestOut, QuestProgressOut
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
    user_id: str = Query(..., min_length=1, max_length=32),
    event_type: EventType = Query(...),
    value: int = Query(1, ge=1, le=100),  # bounded: negative or huge values used to be accepted
    username: str | None = Query(None, max_length=128),
    db: AsyncSession = Depends(get_db)
):
    rewards = await process_quest_event(guild_id, user_id, event_type, value, db, username=username)
    return {"message": "Event processed", "rewards_unlocked": rewards}


@router.get("/{guild_id}/progress/{user_id}", response_model=List[QuestProgressOut])
async def member_progress(guild_id: str, user_id: str, db: AsyncSession = Depends(get_db)):
    """Every active quest with this member's progress towards it."""
    member = (await db.execute(select(MemberProfile.id).where(
        and_(MemberProfile.guild_id == guild_id, MemberProfile.user_id == user_id)
    ))).first()
    if member is None:
        raise HTTPException(status_code=404, detail="Member profile not found.")
    quests = (await db.execute(select(Quest).where(and_(Quest.guild_id == guild_id, Quest.is_active == True)))).scalars().all()  # noqa: E712
    rows = (await db.execute(select(QuestProgress).where(
        and_(QuestProgress.guild_id == guild_id, QuestProgress.user_id == user_id)
    ))).scalars().all()
    by_quest = {r.quest_id: r for r in rows}
    out = []
    for q in quests:
        r = by_quest.get(q.id)
        current = min(r.current_value, q.target_value) if r else 0
        done = bool(r and r.is_completed)
        out.append(QuestProgressOut(
            quest=QuestOut.model_validate(q), current_value=q.target_value if done else current,
            target_value=q.target_value, is_completed=done,
            percentage=100 if done else int(current / q.target_value * 100),
        ))
    return out
