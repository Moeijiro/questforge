import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.db.session import get_db
from app.db.models import MemberProfile
from app.schemas.profile import ProfileOut, RepRequest, RepResultOut
from app.services.progression import (
    calculate_level_from_xp, award_reputation, get_or_create_profile
)

router = APIRouter()

@router.get("/{guild_id}/{user_id}", response_model=ProfileOut)
async def get_member_profile(guild_id: str, user_id: str, db: AsyncSession = Depends(get_db)):
    prof = await get_or_create_profile(guild_id, user_id, f"User_{user_id[-4:]}", None, db)
    level, xp_in_level, needed = calculate_level_from_xp(prof.lifetime_xp)
    badges = json.loads(prof.badges_json or "[]")

    return ProfileOut(
        guild_id=prof.guild_id,
        user_id=prof.user_id,
        username=prof.username,
        avatar_url=prof.avatar_url,
        lifetime_xp=prof.lifetime_xp,
        season_xp=prof.season_xp,
        level=level,
        reputation=prof.reputation,
        streak_days=prof.streak_days,
        xp_in_level=xp_in_level,
        xp_for_next_level=needed,
        badges=badges
    )

@router.post("/rep/{guild_id}", response_model=RepResultOut)
async def give_reputation(guild_id: str, payload: RepRequest, db: AsyncSession = Depends(get_db)):
    try:
        target = await award_reputation(
            guild_id=guild_id,
            from_user_id=payload.from_user_id,
            to_user_id=payload.to_user_id,
            reason=payload.reason,
            db=db
        )
        return RepResultOut(
            success=True,
            to_user_id=target.user_id,
            new_reputation=target.reputation,
            message=f"Reputation awarded to {target.username}!"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
