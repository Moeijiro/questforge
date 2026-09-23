import json
import datetime
from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.db.models import Quest, QuestProgress, MemberProfile
from app.services.progression import award_xp

async def process_quest_event(
    guild_id: str,
    user_id: str,
    event_type: str,
    increment_value: int,
    db: AsyncSession
) -> List[Dict[str, Any]]:
    """
    Evaluates incoming events against active quests and triggers reward engine upon completion.
    """
    stmt = select(Quest).where(
        and_(Quest.guild_id == guild_id, Quest.trigger_type == event_type, Quest.is_active == True)
    )
    res = await db.execute(stmt)
    active_quests = res.scalars().all()

    completed_rewards = []
    now = datetime.datetime.utcnow()

    for quest in active_quests:
        # Check member's progress on this quest
        stmt_p = select(QuestProgress).where(
            and_(
                QuestProgress.guild_id == guild_id,
                QuestProgress.user_id == user_id,
                QuestProgress.quest_id == quest.id
            )
        )
        res_p = await db.execute(stmt_p)
        progress = res_p.scalar_one_or_none()

        if not progress:
            progress = QuestProgress(
                quest_id=quest.id,
                guild_id=guild_id,
                user_id=user_id,
                current_value=0,
                is_completed=False
            )
            db.add(progress)

        if progress.is_completed and not quest.is_repeatable:
            continue

        progress.current_value += increment_value
        progress.updated_at = now

        if progress.current_value >= quest.target_value and not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = now

            # Grant rewards
            profile, did_level_up = await award_xp(guild_id, user_id, quest.reward_xp, db)

            # Grant badge if specified
            if quest.reward_badge_name:
                badges = json.loads(profile.badges_json or "[]")
                if quest.reward_badge_name not in badges:
                    badges.append(quest.reward_badge_name)
                    profile.badges_json = json.dumps(badges)

            completed_rewards.append({
                "quest_id": quest.id,
                "quest_title": quest.title,
                "reward_xp": quest.reward_xp,
                "reward_role_id": quest.reward_role_id,
                "reward_role_name": quest.reward_role_name,
                "reward_badge": quest.reward_badge_name,
                "did_level_up": did_level_up,
                "new_level": profile.level
            })

    await db.commit()
    return completed_rewards
