import pytest
import json
from app.models import Quest
from app.services.progression import get_or_create_profile
from app.services.quest_engine import process_quest_event
from tests.conftest import TestingSessionLocal

@pytest.mark.asyncio
async def test_quest_progress_and_completion():
    guild_id = "g_test"
    user_id = "u_tester"

    async with TestingSessionLocal() as db:
        await get_or_create_profile(guild_id, user_id, "Tester", None, db)

        quest = Quest(
            guild_id=guild_id,
            title="Helper Quest",
            description="Send 2 messages",
            trigger_type="message",
            category="daily",
            target_value=2,
            reward_xp=250,
            reward_badge_name="Helper Badge",
            is_active=True
        )
        db.add(quest)
        await db.commit()

        # Event 1: 1 message -> progress 1/2, not finished
        res1 = await process_quest_event(guild_id, user_id, "message", 1, db)
        assert len(res1) == 0

        # Event 2: 1 message -> progress 2/2 -> completed!
        res2 = await process_quest_event(guild_id, user_id, "message", 1, db)
        assert len(res2) == 1
        assert res2[0]["reward_xp"] == 250
        assert res2[0]["reward_badge"] == "Helper Badge"
