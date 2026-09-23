import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from app.db.base import Base


class GuildConfig(Base):
    __tablename__ = "guild_configs"

    guild_id = Column(String(32), primary_key=True, index=True)
    guild_name = Column(String(255), nullable=False)
    current_season_id = Column(Integer, nullable=True)
    quest_announcement_channel_id = Column(String(32), nullable=True)
    is_enabled = Column(Boolean, default=True)


class Season(Base):
    __tablename__ = "seasons"

    id = Column(Integer, primary_key=True, index=True)
    guild_id = Column(String(32), index=True, nullable=False)
    name = Column(String(128), nullable=False)
    theme = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
