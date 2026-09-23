import pytest

@pytest.mark.asyncio
async def test_quest_creation_and_listing(client):
    guild_id = "apex_league"

    # Create quest
    payload = {
        "title": "Welcome Explorer",
        "description": "Say hello in #general",
        "trigger_type": "message",
        "category": "permanent",
        "target_value": 1,
        "reward_xp": 100
    }
    res = await client.post(f"/api/v1/quests/{guild_id}", json=payload)
    assert res.status_code == 201
    assert res.json()["title"] == "Welcome Explorer"

    # List quests
    list_res = await client.get(f"/api/v1/quests/{guild_id}")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

@pytest.mark.asyncio
async def test_demo_seed_and_leaderboard(client):
    # Seed demo
    seed_res = await client.post("/api/v1/demo/seed")
    assert seed_res.status_code == 200

    # Get leaderboard
    lb_res = await client.get("/api/v1/leaderboards/quest-demo-888?sort_by=lifetime")
    assert lb_res.status_code == 200
    data = lb_res.json()
    assert len(data["entries"]) >= 5
    assert data["entries"][0]["rank"] == 1
    assert data["entries"][0]["lifetime_xp"] >= data["entries"][1]["lifetime_xp"]
