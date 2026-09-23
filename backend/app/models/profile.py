import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from app.db.base import Base


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
