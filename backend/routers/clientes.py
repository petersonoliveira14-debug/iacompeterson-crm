from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from pydantic import BaseModel
from models.cliente import ClienteCreate, ClienteUpdate
from database.supabase import get_supabase
from routers.auth import verify_token

router = APIRouter(prefix="/api", tags=["clientes"])


def get_admin(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    return verify_token(token)


@router.post("/clientes", status_code=201)
async def create_cliente(body: ClienteCreate):
    db = get_supabase()
    data = body.model_dump(exclude_none=True)
    data["status"] = "formulario_recebido"
    result = db.table("clientes").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Erro ao salvar")
    return {"id": result.data[0]["id"], "message": "Briefing recebido com sucesso!"}


@router.get("/admin/clientes")
async def list_clientes(
    status: Optional[str] = None,
    tipo_solucao: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = 50,
    _=Depends(get_admin),
):
    db = get_supabase()
    query = db.table("clientes").select("*").order("created_at", desc=True).limit(limit)
    if status:
        query = query.eq("status", status)
    if tipo_solucao:
        query = query.eq("tipo_solucao", tipo_solucao)
    result = query.execute()
    items = result.data or []
    if q:
        q = q.lower()
        items = [c for c in items if q in (c.get("nome_contato") or "").lower() or q in (c.get("nome_empresa") or "").lower()]
    return {"items": items, "total": len(items)}


@router.get("/admin/clientes/{cliente_id}")
async def get_cliente(cliente_id: str, _=Depends(get_admin)):
    db = get_supabase()
    result = db.table("clientes").select("*").eq("id", cliente_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return result.data


@router.patch("/admin/clientes/{cliente_id}")
async def update_cliente(cliente_id: str, body: ClienteUpdate, _=Depends(get_admin)):
    db = get_supabase()
    data = body.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    result = db.table("clientes").update(data).eq("id", cliente_id).execute()
    return result.data[0] if result.data else {}


@router.get("/admin/metricas")
async def get_metricas(_=Depends(get_admin)):
    db = get_supabase()
    clientes = db.table("clientes").select("status, created_at").execute().data or []

    total = len(clientes)
    em_negociacao = sum(1 for c in clientes if c["status"] in [
        "formulario_recebido", "prd_elaborado", "reuniao_1", "prd_aprovado",
        "proposta_elaborada", "proposta_enviada"
    ])
    em_execucao = sum(1 for c in clientes if c["status"] == "em_execucao")
    entregues = sum(1 for c in clientes if c["status"] == "entregue")

    # Receita: soma valores das propostas aceitas no mês
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    propostas = db.table("propostas").select("pacote_escolhido, aceito_em").eq("status", "aceita").execute().data or []
    receita_mes = 0
    for p in propostas:
        if p.get("aceito_em"):
            aceito = datetime.fromisoformat(p["aceito_em"].replace("Z", "+00:00"))
            if aceito.year == now.year and aceito.month == now.month:
                # Buscar valor do pacote escolhido
                pass  # Simplificado — implementar conforme necessário

    return {
        "total_leads": total,
        "em_negociacao": em_negociacao,
        "em_execucao": em_execucao,
        "entregues_mes": entregues,
        "receita_mes": receita_mes,
        "taxa_conversao": round((entregues / total * 100) if total > 0 else 0, 1),
    }


class DocumentoCreate(BaseModel):
    tipo: str
    versao: int = 1
    conteudo: str
    status: str = "rascunho"


@router.get("/admin/clientes/{cliente_id}/documentos")
async def list_documentos(cliente_id: str, _=Depends(get_admin)):
    db = get_supabase()
    result = db.table("documentos").select("*").eq("cliente_id", cliente_id).order("created_at", desc=True).execute()
    return result.data or []


@router.post("/admin/clientes/{cliente_id}/documentos", status_code=201)
async def create_documento(cliente_id: str, body: DocumentoCreate, _=Depends(get_admin)):
    db = get_supabase()
    result = db.table("documentos").insert({
        "cliente_id": cliente_id,
        "tipo": body.tipo,
        "versao": body.versao,
        "conteudo": body.conteudo,
        "status": body.status,
    }).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Erro ao salvar documento")
    return result.data[0]
