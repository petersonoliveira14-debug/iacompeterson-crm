from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.supabase import settings
from routers import auth, clientes, propostas

app = FastAPI(
    title="IA com Peterson — CRM API",
    version="1.0.0",
    docs_url="/docs",
)

origins = [o.strip() for o in settings.allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(clientes.router)
app.include_router(propostas.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "IA com Peterson CRM"}
