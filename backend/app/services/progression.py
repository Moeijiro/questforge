import math
import json
import datetime
from typing import Tuple, Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models import MemberProfile, ReputationLog, GuildConfig
from app.core.config import settings

def calculate_xp_for_level(level: int) -> int:
    """Returns the cumulative XP required to reach the given level."""
    if level <= 1:
        return 0
    return math.floor(100 * math.pow(level, 1.5))

def calculate_level_from_xp(total_xp: int) -> Tuple[int, int, int]:
    """
    Returns: (current_level, current_level_xp, xp_for_next_level)
    """
    level = 1
    while True:
        next_xp = calculate_xp_for_level(level + 1)
        if total_xp < next_xp:
            current_base = calculate_xp_for_level(level)
            xp_in_level = total_xp - current_base
            needed = next_xp - current_base
            return level, xp_in_level, needed
        level += 1

def update_streak_for_today(profile: MemberProfile) -> bool:
    """Updates daily activity streak safely without harsh penalties."""
    today_str = datetime.datetime.utcnow().date().isoformat()
    if profile.last_active_date == today_str:
        return False  # Already recorded today

    yesterday_str = (datetime.datetime.utcnow().date() - datetime.timedelta(days=1)).isoformat()
    if profile.last_active_date == yesterday_str:
        profile.streak_days += 1
    else:
        profile.streak_days = 1

    profile.last_active_date = today_str
    return True

async def get_or_create_profile(
    guild_id: str,
    user_id: str,
    username: str,
    avatar_url: Optional[str],
    db: AsyncSession
) -> MemberProfile:
    stmt = select(MemberProfile).where(
        and_(MemberProfile.guild_id == guild_id, MemberProfile.user_id == user_id)
    )
    res = await db.execute(stmt)
    prof = res.scalar_one_or_none()

    if not prof:
        prof = MemberProfile(
            guild_id=guild_id,
            user_id=user_id,
            username=username,
            avatar_url=avatar_url,
            lifetime_xp=0,
            season_xp=0,
            level=1,
            reputation=0,
            streak_days=0,
            badges_json="[]"
        )
        db.add(prof)
        await db.commit()
        await db.refresh(prof)
    return prof

async def award_xp(
    guild_id: str,
    user_id: str,
    xp_amount: int,
    db: AsyncSession
) -> Tuple[MemberProfile, bool]:
    """Awards XP, advances level, and updates active streak. Returns (profile, did_level_up)."""
    stmt = select(MemberProfile).where(
        and_(MemberProfile.guild_id == guild_id, MemberProfile.user_id == user_id)
    )
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        raise ValueError("Profile not found.")

    old_level = profile.level
    profile.lifetime_xp += xp_amount
    profile.season_xp += xp_amount

    new_level, _, _ = calculate_level_from_xp(profile.lifetime_xp)
    profile.level = new_level
    update_streak_for_today(profile)

    did_level_up = new_level > old_level
    await db.commit()
    await db.refresh(profile)
    return profile, did_level_up

async def award_reputation(
    guild_id: str,
    from_user_id: str,
    to_user_id: str,
    reason: Optional[str],
    db: AsyncSession
) -> MemberProfile:
    """Safe reputation transfer with cooldowns, self-rep guards, and anti-abuse limits."""
    if from_user_id == to_user_id:
        raise ValueError("You cannot award reputation to yourself.")

    # Check cooldown
    # Every giver gets a profile, so the cooldown applies to them too (a giver without a
    # profile used to skip the cooldown and could hand out unlimited reputation).
    sender = await get_or_create_profile(guild_id, from_user_id, from_user_id, None, db)

    now = datetime.datetime.utcnow()
    cooldown = datetime.timedelta(hours=settings.REP_COOLDOWN_HOURS)

    if sender and sender.last_rep_given_at:
        if (now - sender.last_rep_given_at) < cooldown:
            remaining = cooldown - (now - sender.last_rep_given_at)
            hours_left = max(1, int(remaining.total_seconds() / 3600))
            raise ValueError(f"Reputation cooldown active. Please wait {hours_left} hour(s).")

    # Target profile
    stmt_to = select(MemberProfile).where(
        and_(MemberProfile.guild_id == guild_id, MemberProfile.user_id == to_user_id)
    )
    res_to = await db.execute(stmt_to)
    target = res_to.scalar_one_or_none()
    if not target:
        raise ValueError("Target user profile not found.")

    target.reputation += 1
    sender.last_rep_given_at = now

    db.add(ReputationLog(
        guild_id=guild_id,
        from_user_id=from_user_id,
        to_user_id=to_user_id,
        reason=reason[:255] if reason else "Helpful community interaction"
    ))

    await db.commit()
    await db.refresh(target)
    return target
