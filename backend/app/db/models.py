import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db.session import Base

class GuildConfig(Base):
    __tablename__ = "guild_configs"

    guild_id = Column(String(32), primary_key=True, index=True)
    guild_name = Column(String(255), nullable=False)
    current_season_id = Column(Integer, nullable=True)
    quest_announcement_channel_id = Column(String(32), nullable=True)
    is_enabled = Column(Boolean, default=True)

class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    guild_id = Column(String(32), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    trigger_type = Column(String(32), nullable=False)  # message, reaction, voice, reputation, manual
    category = Column(String(32), nullable=False, default="daily")  # daily, weekly, seasonal, permanent, event
    target_value = Column(Integer, nullable=False, default=1)
    reward_xp = Column(Integer, nullable=False, default=100)
    reward_role_id = Column(String(32), nullable=True)
    reward_role_name = Column(String(128), nullable=True)
    reward_badge_name = Column(String(128), nullable=True)
    is_repeatable = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class QuestProgress(Base):
    __tablename__ = "quest_progress"

    id = Column(Integer, primary_key=True, index=True)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False, index=True)
    guild_id = Column(String(32), index=True, nullable=False)
    user_id = Column(String(32), index=True, nullable=False)
    current_value = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (
        Index("ix_progress_user_quest", "guild_id", "user_id", "quest_id", unique=True),
    )

class MemberProfile(Base):
    __tablename__ = "member_profiles"

    id = Column(Integer, primary_key=True, index=True)
    guild_id = Column(String(32), index=True, nullable=False)
    user_id = Column(String(32), index=True, nullable=False)
    username = Column(String(128), nullable=False)
    avatar_url = Column(String(512), nullable=True)
    lifetime_xp = Column(Integer, default=0)
    season_xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    reputation = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    last_active_date = Column(String(16), nullable=True)  # YYYY-MM-DD
    last_rep_given_at = Column(DateTime, nullable=True)
    badges_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (
        Index("ix_profile_user_guild", "guild_id", "user_id", unique=True),
    )

class ReputationLog(Base):
    __tablename__ = "reputation_logs"

    id = Column(Integer, primary_key=True, index=True)
    guild_id = Column(String(32), index=True, nullable=False)
    from_user_id = Column(String(32), nullable=False)
    to_user_id = Column(String(32), nullable=False)
    reason = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Season(Base):
    __tablename__ = "seasons"

    id = Column(Integer, primary_key=True, index=True)
    guild_id = Column(String(32), index=True, nullable=False)
    name = Column(String(128), nullable=False)
    theme = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
