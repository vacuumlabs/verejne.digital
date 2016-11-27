# -*- coding: utf-8 -*-
import psycopg2
import sqlalchemy
from sqlalchemy import Column, Float, Integer, String, Boolean, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import sessionmaker
import os
import yaml

# Defining database scheme here
with open("db_config.yaml", "r") as stream:
    config = yaml.load(stream)
engine = sqlalchemy.create_engine('postgresql+psycopg2://' + config["user"] + "@/" + config["db"])
with engine.connect() as conn:
    conn.execute("SET search_path TO obstaravania")


Base = declarative_base()

class Firma(Base):
    __tablename__ = 'firma'
    id = Column(Integer, primary_key=True)
    ico = Column(String, index=True)
    name = Column(String)
    address = Column(String)
    email = Column(String)

class Candidate(Base):
    __tablename__ = 'candidate'
    id = Column(Integer, primary_key=True)
    score = Column(Float)
    company_id = Column(Integer, ForeignKey("firma.id"))
    company = relationship("Firma")
    obstaravanie_id = Column(Integer, ForeignKey("obstaravanie.id"))
    obstaravanie = relationship("Obstaravanie", back_populates="candidates",
                                foreign_keys=[obstaravanie_id])
    reason_id = Column(Integer, ForeignKey("obstaravanie.id"))
    reason = relationship("Obstaravanie", foreign_keys=[reason_id])

# Prediction for average price and stddev.
class Prediction(Base):
    __tablename__ = 'prediction'
    id = Column(Integer, primary_key=True)
    obstaravanie_id = Column(Integer, ForeignKey("obstaravanie.id"))
    obstaravanie = relationship("Obstaravanie", back_populates="predictions",
                                foreign_keys=[obstaravanie_id])
    mean = Column(Float)
    stdev = Column(Float)
    num = Column(Integer) # Sample size from which the estimates were generated

class Obstaravanie(Base):
    __tablename__ = 'obstaravanie'
    id = Column(Integer, primary_key=True)
    official_id = Column(String, index=True)
    description = Column(String)
    title = Column(String)
    json = Column(String)
    bulletin_year = Column(Integer)
    bulleting_number = Column(Integer)
    bulletin_id = Column(Integer)
    ekosystem_id = Column(Integer)
    contract_id = Column(Integer, index=True)
    finished = Column(Boolean)
    draft_price = Column(Float)
    final_price = Column(Float)
    winner_id = Column(Integer, ForeignKey("firma.id"))
    winner = relationship("Firma", back_populates="obstaravania", foreign_keys=[winner_id])
    customer_id = Column(Integer, ForeignKey("firma.id"))
    customer = relationship("Firma", back_populates="obstaraval", foreign_keys=[customer_id])
    candidates = relationship("Candidate", back_populates="obstaravanie",
                              foreign_keys=[Candidate.obstaravanie_id])
    predictions = relationship("Prediction", back_populates="obstaravanie",
                              foreign_keys=[Prediction.obstaravanie_id])

Firma.obstaravania = relationship(
        "Obstaravanie", order_by=Obstaravanie.id, back_populates="winner",
        foreign_keys=[Obstaravanie.winner_id])
Firma.obstaraval = relationship(
        "Obstaravanie", order_by=Obstaravanie.id, back_populates="customer",
        foreign_keys=[Obstaravanie.customer_id])

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
