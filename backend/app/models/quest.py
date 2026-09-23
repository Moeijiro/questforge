import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from app.db.base import Base


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
