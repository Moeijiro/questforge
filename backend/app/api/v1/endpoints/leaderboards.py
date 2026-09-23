from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.db.models import MemberProfile
from app.schemas.leaderboard import LeaderboardResponse, LeaderboardEntryOut

router = APIRouter()

@router.get("/{guild_id}", response_model=LeaderboardResponse)
async def get_leaderboard(
    guild_id: str,
    sort_by: str = Query("lifetime", description="lifetime, season, reputation"),
    limit: int = Query(50, le=100),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(MemberProfile).where(MemberProfile.guild_id == guild_id)
    if sort_by == "season":
        stmt = stmt.order_by(MemberProfile.season_xp.desc())
    elif sort_by == "reputation":
        stmt = stmt.order_by(MemberProfile.reputation.desc())
    else:
        stmt = stmt.order_by(MemberProfile.lifetime_xp.desc())

    stmt = stmt.limit(limit)
    res = await db.execute(stmt)
    profiles = res.scalars().all()

    entries = []
    for rank, p in enumerate(profiles, start=1):
        entries.append(LeaderboardEntryOut(
            rank=rank,
            user_id=p.user_id,
            username=p.username,
            avatar_url=p.avatar_url,
            level=p.level,
            lifetime_xp=p.lifetime_xp,
            season_xp=p.season_xp,
            reputation=p.reputation,
            streak_days=p.streak_days
        ))

    return LeaderboardResponse(
        guild_id=guild_id,
        filter_type=sort_by,
        entries=entries
    )
