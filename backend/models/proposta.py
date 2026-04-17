from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class PacoteCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    itens: List[str] = []
    valor: float
    prazo_dias: int
    destaque: bool = False


class PropostaCreate(BaseModel):
    validade_ate: Optional[date] = None
    pacotes: List[PacoteCreate]


class AceiteRequest(BaseModel):
    pacote_id: str
    nome_assinante: str


class PacoteResponse(BaseModel):
    id: str
    nome: str
    descricao: Optional[str]
    itens: List[str]
    valor: float
    prazo_dias: int
    destaque: bool


class PropostaResponse(BaseModel):
    id: str
    token: str
    status: str
    validade_ate: Optional[date]
    cliente: dict
    pacotes: List[PacoteResponse]
