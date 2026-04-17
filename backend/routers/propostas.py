import secrets
from fastapi import APIRouter, HTTPException, Depends, Header, Request
from models.proposta import PropostaCreate, AceiteRequest
from database.supabase import get_supabase
from routers.auth import verify_token

router = APIRouter(prefix="/api", tags=["propostas"])


def get_admin(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    return verify_token(token)


@router.get("/propostas/{token}")
async def get_proposta_publica(token: str):
    db = get_supabase()
    result = db.table("propostas").select("*, clientes(nome_contato, nome_empresa)").eq("token", token).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Proposta não encontrada")

    proposta = result.data
    pacotes = db.table("proposta_pacotes").select("*").eq("proposta_id", proposta["id"]).execute().data or []

    return {
        "id": proposta["id"],
        "token": proposta["token"],
        "status": proposta["status"],
        "validade_ate": proposta["validade_ate"],
        "cliente": proposta.get("clientes", {}),
        "pacotes": pacotes,
    }


@router.post("/propostas/{token}/aceitar")
async def aceitar_proposta(token: str, body: AceiteRequest, request: Request):
    db = get_supabase()
    result = db.table("propostas").select("*").eq("token", token).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Proposta não encontrada")

    proposta = result.data
    if proposta["status"] != "enviada":
        raise HTTPException(status_code=400, detail="Esta proposta não está disponível para aceite")

    from datetime import datetime, timezone
    db.table("propostas").update({
        "status": "aceita",
        "pacote_escolhido": body.pacote_id,
        "aceito_em": datetime.now(timezone.utc).isoformat(),
        "aceito_por_nome": body.nome_assinante,
        "aceito_ip": request.client.host if request.client else None,
    }).eq("token", token).execute()

    # Atualizar status do cliente
    db.table("clientes").update({"status": "proposta_aceita"}).eq("id", proposta["cliente_id"]).execute()

    return {"message": "Proposta aceita com sucesso!"}


@router.get("/admin/clientes/{cliente_id}/propostas")
async def list_propostas(cliente_id: str, _=Depends(get_admin)):
    db = get_supabase()
    result = db.table("propostas").select("*").eq("cliente_id", cliente_id).execute()
    return result.data or []


@router.post("/admin/clientes/{cliente_id}/propostas", status_code=201)
async def create_proposta(cliente_id: str, body: PropostaCreate, _=Depends(get_admin)):
    db = get_supabase()
    token = secrets.token_urlsafe(24)

    proposta_data = {
        "cliente_id": cliente_id,
        "token": token,
        "status": "rascunho",
        "validade_ate": body.validade_ate.isoformat() if body.validade_ate else None,
    }
    prop_result = db.table("propostas").insert(proposta_data).execute()
    if not prop_result.data:
        raise HTTPException(status_code=500, detail="Erro ao criar proposta")

    proposta_id = prop_result.data[0]["id"]

    # Inserir pacotes
    for pacote in body.pacotes:
        db.table("proposta_pacotes").insert({
            "proposta_id": proposta_id,
            **pacote.model_dump(),
        }).execute()

    # Atualizar status do cliente
    db.table("clientes").update({"status": "proposta_elaborada"}).eq("id", cliente_id).execute()

    return {"id": proposta_id, "token": token, "link": f"/proposta/{token}"}


@router.post("/admin/propostas/{proposta_id}/enviar")
async def enviar_proposta(proposta_id: str, _=Depends(get_admin)):
    db = get_supabase()
    prop = db.table("propostas").select("cliente_id").eq("id", proposta_id).single().execute()
    if not prop.data:
        raise HTTPException(status_code=404, detail="Proposta não encontrada")

    db.table("propostas").update({"status": "enviada"}).eq("id", proposta_id).execute()
    db.table("clientes").update({"status": "proposta_enviada"}).eq("id", prop.data["cliente_id"]).execute()

    return {"message": "Proposta marcada como enviada"}
