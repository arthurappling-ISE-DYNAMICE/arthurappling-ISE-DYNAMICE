from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    contact_info = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    work_orders = relationship("WorkOrder", back_populates="client")

class Subcontractor(Base):
    __tablename__ = "subcontractors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    contact_info = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    work_orders = relationship("WorkOrder", secondary="work_order_subcontractors", back_populates="subcontractors")

class WorkOrder(Base):
    __tablename__ = "work_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    client = relationship("Client", back_populates="work_orders")
    subcontractors = relationship("Subcontractor", secondary="work_order_subcontractors", back_populates="work_orders")
    receipts = relationship("Receipt", back_populates="work_order")
    photos = relationship("Photo", back_populates="work_order")
    invoices = relationship("Invoice", back_populates="work_order")

class WorkOrderSubcontractor(Base):
    __tablename__ = "work_order_subcontractors"
    
    work_order_id = Column(Integer, ForeignKey("work_orders.id"), primary_key=True)
    subcontractor_id = Column(Integer, ForeignKey("subcontractors.id"), primary_key=True)

class Receipt(Base):
    __tablename__ = "receipts"
    
    id = Column(Integer, primary_key=True, index=True)
    work_order_id = Column(Integer, ForeignKey("work_orders.id"), nullable=True)
    file_path = Column(String, nullable=False)
    vendor = Column(String, index=True, nullable=True)
    date = Column(DateTime, nullable=True)
    amount = Column(Float, nullable=True)
    tax = Column(Float, nullable=True)
    payment_method = Column(String, nullable=True)
    invoice_number = Column(String, index=True, nullable=True)
    category = Column(String, index=True, nullable=True)
    notes = Column(Text, nullable=True)
    checksum = Column(String, nullable=False)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    ocr_text = Column(Text, nullable=True)
    
    work_order = relationship("WorkOrder", back_populates="receipts")

class Photo(Base):
    __tablename__ = "photos"
    
    id = Column(Integer, primary_key=True, index=True)
    work_order_id = Column(Integer, ForeignKey("work_orders.id"), nullable=False)
    file_path = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=True)
    gps_lat = Column(Float, nullable=True)
    gps_long = Column(Float, nullable=True)
    sequence_type = Column(String, nullable=True) # Before, During, After
    checksum = Column(String, nullable=False)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    
    work_order = relationship("WorkOrder", back_populates="photos")

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    work_order_id = Column(Integer, ForeignKey("work_orders.id"), nullable=False)
    file_path = Column(String, nullable=False)
    invoice_number = Column(String, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    checksum = Column(String, nullable=False)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    
    work_order = relationship("WorkOrder", back_populates="invoices")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, nullable=False) # Upload, Modify, Export, Delete
    entity_type = Column(String, nullable=False) # Receipt, Photo, Invoice, WorkOrder
    entity_id = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = Column(String, default="System")
    hash = Column(String, nullable=False) # Hash of the event data for immutability
    details = Column(Text, nullable=True)
