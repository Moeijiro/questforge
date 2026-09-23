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


async def _quest(client, guild, trigger="message", target=2, repeatable=False):
    res = await client.post(f"/api/v1/quests/{guild}", json={
        "title": f"{trigger} quest", "description": "Do the thing", "trigger_type": trigger, "category": "daily",
        "target_value": target, "reward_xp": 100, "is_repeatable": repeatable,
    })
    assert res.status_code == 201
    return res.json()


@pytest.mark.asyncio
async def test_first_event_from_a_new_member_creates_their_profile(client):
    await _quest(client, "g-new", target=1)
    res = await client.post("/api/v1/quests/g-new/event", params={"user_id": "newbie", "event_type": "message", "username": "Newbie"})
    assert res.status_code == 200 and len(res.json()["rewards_unlocked"]) == 1
    profile = (await client.get("/api/v1/profiles/g-new/newbie")).json()
    assert profile["lifetime_xp"] == 100 and profile["username"] == "Newbie"


@pytest.mark.asyncio
async def test_repeatable_quests_pay_out_again(client):
    await _quest(client, "g-rep", target=2, repeatable=True)
    rewards = 0
    for _ in range(4):
        res = await client.post("/api/v1/quests/g-rep/event", params={"user_id": "u", "event_type": "message"})
        rewards += len(res.json()["rewards_unlocked"])
    assert rewards == 2


@pytest.mark.asyncio
async def test_event_values_are_bounded(client):
    for bad in (-50, 0, 10_000):
        res = await client.post("/api/v1/quests/g-b/event", params={"user_id": "u", "event_type": "message", "value": bad})
        assert res.status_code == 422
    assert (await client.post("/api/v1/quests/g-b/event", params={"user_id": "u", "event_type": "dance"})).status_code == 422


@pytest.mark.asyncio
async def test_reading_an_unknown_profile_does_not_create_it(client):
    assert (await client.get("/api/v1/profiles/g-read/ghost")).status_code == 404
    board = (await client.get("/api/v1/leaderboards/g-read")).json()
    assert board["entries"] == []


@pytest.mark.asyncio
async def test_reputation_has_a_cooldown_for_everyone_and_advances_reputation_quests(client):
    await _quest(client, "g-rp", trigger="reputation", target=1)
    await client.post("/api/v1/quests/g-rp/event", params={"user_id": "helper", "event_type": "message"})
    first = await client.post("/api/v1/profiles/rep/g-rp", json={"from_user_id": "stranger", "to_user_id": "helper"})
    assert first.status_code == 200
    again = await client.post("/api/v1/profiles/rep/g-rp", json={"from_user_id": "stranger", "to_user_id": "helper"})
    assert again.status_code == 400  # the stranger now has a profile, so the cooldown applies
    progress = (await client.get("/api/v1/quests/g-rp/progress/helper")).json()
    assert progress[0]["is_completed"] is True
