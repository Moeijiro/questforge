import pytest
import datetime
from app.services.progression import (
    calculate_xp_for_level, calculate_level_from_xp,
    award_xp, award_reputation, get_or_create_profile, update_streak_for_today
)
from tests.conftest import TestingSessionLocal

def test_xp_and_level_formula():
    assert calculate_xp_for_level(1) == 0
    assert calculate_xp_for_level(2) == 282
    assert calculate_xp_for_level(5) == 1118

    lvl, in_lvl, needed = calculate_level_from_xp(500)
    assert lvl == 2
    assert in_lvl == 500 - 282

@pytest.mark.asyncio
async def test_award_xp_and_level_up():
    async with TestingSessionLocal() as db:
        prof = await get_or_create_profile("g1", "u1", "PlayerOne", None, db)
        assert prof.level == 1
        assert prof.lifetime_xp == 0

        # Award 300 XP -> should advance to Level 2
        updated, leveled_up = await award_xp("g1", "u1", 300, db)
        assert updated.level == 2
        assert leveled_up is True
        assert updated.lifetime_xp == 300
        assert updated.streak_days == 1

@pytest.mark.asyncio
async def test_reputation_self_rep_and_cooldown():
    async with TestingSessionLocal() as db:
        await get_or_create_profile("g1", "alice", "Alice", None, db)
        await get_or_create_profile("g1", "bob", "Bob", None, db)

        # Self-rep fails
        with pytest.raises(ValueError, match="cannot award reputation to yourself"):
            await award_reputation("g1", "alice", "alice", "self", db)

        # Alice reps Bob
        bob_updated = await award_reputation("g1", "alice", "bob", "Helped with code", db)
        assert bob_updated.reputation == 1

        # Second rep immediately fails with cooldown
        with pytest.raises(ValueError, match="Reputation cooldown active"):
            await award_reputation("g1", "alice", "bob", "Again", db)
