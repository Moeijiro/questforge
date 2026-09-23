import json
import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.db.session import get_db
from app.db.models import GuildConfig, Quest, MemberProfile

router = APIRouter()

DEMO_GUILD_ID = "quest-demo-888"

@router.post("/seed")
async def seed_demo_quest_data(db: AsyncSession = Depends(get_db)):
    # 1. Guild
    stmt_g = select(GuildConfig).where(GuildConfig.guild_id == DEMO_GUILD_ID)
    res_g = await db.execute(stmt_g)
    if not res_g.scalar_one_or_none():
        db.add(GuildConfig(
            guild_id=DEMO_GUILD_ID,
            guild_name="Apex Community League",
            is_enabled=True
        ))
        await db.commit()

    # 2. Quests
    sample_quests = [
        ("Daily Technical Contributor", "Post 5 constructive messages in coding channels", "message", "daily", 5, 150, None, None, "Daily Active"),
        ("Community Guide", "Help other members and earn 2 reputation endorsements", "reputation", "weekly", 2, 400, "role-mentor", "Community Mentor", "Helper Badge"),
        ("Voice Stage Enthusiast", "Spend 30 minutes in community voice stages", "voice", "weekly", 30, 300, None, None, "Voice Regular"),
        ("Season 1 Pioneer", "Reach Level 10 and maintain a 7-day streak", "manual", "seasonal", 1, 1500, "role-pioneer", "Season Pioneer", "Gold Pioneer Trophy")
    ]

    for title, desc, trigger, cat, target, xp, r_role, r_name, r_badge in sample_quests:
        stmt_q = select(Quest).where(and_(Quest.guild_id == DEMO_GUILD_ID, Quest.title == title))
        res_q = await db.execute(stmt_q)
        if not res_q.scalar_one_or_none():
            db.add(Quest(
                guild_id=DEMO_GUILD_ID,
                title=title,
                description=desc,
                trigger_type=trigger,
                category=cat,
                target_value=target,
                reward_xp=xp,
                reward_role_id=r_role,
                reward_role_name=r_name,
                reward_badge_name=r_badge,
                is_active=True
            ))

    # 3. Leaderboard profiles
    sample_profiles = [
        ("u_1", "CyberValkyrie", 8450, 2400, 18, 42, 12, ["Gold Pioneer Trophy", "Helper Badge"]),
        ("u_2", "RustaceanMax", 6120, 1850, 15, 29, 7, ["Helper Badge", "Daily Active"]),
        ("u_3", "PixelKnight", 4800, 1200, 13, 19, 5, ["Daily Active"]),
        ("u_4", "DevSamurai", 3200, 950, 10, 14, 3, ["Voice Regular"]),
        ("u_5", "NeonCoder", 1500, 450, 6, 8, 2, []),
    ]

    for uid, uname, l_xp, s_xp, lvl, rep, streak, badges in sample_profiles:
        stmt_p = select(MemberProfile).where(and_(MemberProfile.guild_id == DEMO_GUILD_ID, MemberProfile.user_id == uid))
        res_p = await db.execute(stmt_p)
        if not res_p.scalar_one_or_none():
            db.add(MemberProfile(
                guild_id=DEMO_GUILD_ID,
                user_id=uid,
                username=uname,
                avatar_url=f"https://api.dicebear.com/7.x/bottts/svg?seed={uname}",
                lifetime_xp=l_xp,
                season_xp=s_xp,
                level=lvl,
                reputation=rep,
                streak_days=streak,
                badges_json=json.dumps(badges)
            ))

    await db.commit()
    return {"message": "QuestForge demo seeded successfully for quest-demo-888"}
