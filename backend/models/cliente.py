from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ClienteCreate(BaseModel):
    nome_contato: str
    nome_empresa: Optional[str] = None
    whatsapp: str
    segmento: str
    tipo_solucao: str
    subtipo: Optional[str] = None
    como_gerencia_hoje: Optional[str] = None
    maior_dor: Optional[str] = None
    volume_atendimentos: Optional[str] = None
    resultado_esperado: Optional[str] = None
    prazo_desejado: Optional[str] = None
    faixa_investimento: Optional[str] = None
    observacoes: Optional[str] = None


class ClienteUpdate(BaseModel):
    status: Optional[str] = None
    nome_contato: Optional[str] = None
    nome_empresa: Optional[str] = None
    whatsapp: Optional[str] = None


class ClienteResponse(BaseModel):
    id: str
    created_at: datetime
    status: str
    nome_contato: str
    nome_empresa: Optional[str]
    whatsapp: str
    segmento: str
    tipo_solucao: str
    subtipo: Optional[str]
    maior_dor: Optional[str]
    resultado_esperado: Optional[str]
    prazo_desejado: Optional[str]
    faixa_investimento: Optional[str]
