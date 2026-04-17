# IA com Peterson — CRM & Formulário de Captação

Sistema completo para captação e gestão de clientes da IA com Peterson.

## Estrutura

```
iacompeterson-crm/
├── frontend/     # Next.js 14 — formulário público + admin
└── backend/      # Python FastAPI — API REST
```

## Páginas

| Rota | Quem acessa | O que faz |
|------|-------------|-----------|
| `/cliente` | Público | Formulário multi-step interativo |
| `/proposta/[token]` | Cliente (link privado) | Visualizar proposta + aceitar |
| `/admin/login` | Peterson | Login do painel |
| `/admin/dashboard` | Peterson | Métricas + clientes recentes |
| `/admin/clientes` | Peterson | Lista + busca de clientes |
| `/admin/pipeline` | Peterson | Kanban por estágio |

---

## Setup: Supabase (Banco de Dados)

1. Criar conta em [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Acessar **SQL Editor** e executar o conteúdo de `backend/database/schema.sql`
4. Copiar as chaves em **Project Settings → API**:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` (secret) → `SUPABASE_SERVICE_KEY`

---

## Setup: Backend (FastAPI)

```bash
cd backend
cp .env.example .env
# Preencher o .env com suas chaves

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API disponível em: `http://localhost:8000`  
Documentação: `http://localhost:8000/docs`

---

## Setup: Frontend (Next.js)

```bash
cd frontend
npm install

# Criar arquivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```

Frontend disponível em: `http://localhost:3000`

---

## Deploy em Produção

### Frontend → Vercel

1. Push do código para GitHub
2. Importar projeto no [vercel.com](https://vercel.com)
3. Configurar variável de ambiente:
   - `NEXT_PUBLIC_API_URL` = URL do backend no Railway
4. Configurar domínio `iacompeterson.com.br` em **Domains**

### Backend → Railway

1. Criar conta em [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo (selecionar pasta `backend/`)
3. Configurar variáveis de ambiente (todas do `.env.example`)
4. O Railway gera uma URL HTTPS automaticamente

### DNS (iacompeterson.com.br)

Apontar DNS do domínio para a Vercel conforme instruções de [Custom Domains no Vercel](https://vercel.com/docs/projects/domains).

---

## Variáveis de Ambiente

### Backend (`.env`)
| Variável | Descrição |
|----------|-----------|
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | Chave service_role do Supabase |
| `JWT_SECRET` | Chave secreta para tokens JWT (gerar aleatória) |
| `ADMIN_EMAIL` | E-mail do login admin |
| `ADMIN_PASSWORD` | Senha do login admin |
| `ALLOWED_ORIGINS` | URLs permitidas (frontend) separadas por vírgula |

### Frontend (`.env.local`)
| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL do backend FastAPI |
