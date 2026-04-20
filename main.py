"""
=============================================
VAMPIRO: A MÁSCARA — PYTHON AI BACKEND
api/main.py

Instale: pip install fastapi uvicorn anthropic python-dotenv pydantic
Execute: uvicorn api.main:app --reload --port 8000

Para usar com o front-end:
  1. Crie um .env com ANTHROPIC_API_KEY=sk-ant-...
  2. O front-end pode apontar para http://localhost:8000/chat
  3. No Vercel: faça deploy como Serverless Function ou use a API direta do front.
=============================================
"""

from __future__ import annotations

import os
import json
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import anthropic

# ── env ──────────────────────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# ── app ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Vampiro: A Máscara — AI Assistant API",
    description="Backend Python para o assistente de ficha de Vampiro: A Máscara v20.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Ajuste para seu domínio em produção
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── schemas ───────────────────────────────────────────────────────────────────
class CharacterSheet(BaseModel):
    """Representa a ficha do personagem enviada pelo front-end."""
    name:       Optional[str] = None
    player:     Optional[str] = None
    clan:       Optional[str] = None
    path:       Optional[str] = "humanidade"
    generation: Optional[int] = 13
    nature:     Optional[str] = None
    behavior:   Optional[str] = None

    attrs:       Optional[Dict[str, int]] = Field(default_factory=dict)
    skills:      Optional[Dict[str, int]] = Field(default_factory=dict)
    disciplines: Optional[Dict[str, int]] = Field(default_factory=dict)
    backgrounds: Optional[Dict[str, int]] = Field(default_factory=dict)
    virtues:     Optional[Dict[str, int]] = Field(default_factory=dict)

    humanity:   Optional[int] = None
    willpower:  Optional[int] = None
    blood_pts:  Optional[int] = None

class Message(BaseModel):
    role:    str   # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    message:   str
    history:   List[Message] = Field(default_factory=list)
    character: Optional[CharacterSheet] = None

class ChatResponse(BaseModel):
    reply:   str
    tokens:  int

class DiceRequest(BaseModel):
    pool:       int = Field(ge=1, le=30, description="Número de dados d10")
    difficulty: int = Field(ge=2, le=10, default=6, description="Dificuldade (2-10)")
    attribute:  Optional[str] = None
    skill:      Optional[str] = None

class DiceResponse(BaseModel):
    rolls:     List[int]
    successes: int
    ones:      int
    botch:     bool
    result:    str  # "botch" | "fail" | "success" | "exceptional"
    verdict:   str

class SheetAnalysis(BaseModel):
    character: CharacterSheet
    focus:     str = "geral"  # "combate" | "social" | "investigação" | "geral"

# ── system prompt ──────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """Você é um assistente especialista e narrador veterano de Vampiro: A Máscara (Edição de 20º Aniversário, White Wolf / Onyx Path Publishing).

REGRAS DE COMPORTAMENTO:
- Responda SEMPRE em português brasileiro com vocabulário da tradução oficial.
- Use terminologia correta: Narrador, Membros/Cainitas, Abraço, Vitae, Besta, Máscara, Jyhad, Gehenna, Golconda, frenesi, torpor, diablerie, ancillae, ancião, neófito.
- Seja didático — explique como veterano ensinando iniciantes, mas com profundidade quando perguntado.
- Máximo 3-4 parágrafos por resposta. Use exemplos práticos de mesa.
- Quando a ficha do personagem for fornecida, use-a para personalizar as respostas.

CONHECIMENTO DO SISTEMA:
- Sistema de dados: pool de d10. Atributo + Habilidade = dados. Resultado ≥ dificuldade (padrão 6) = sucesso.
- Falha crítica (botch): zero sucessos E pelo menos um "1" rolado.
- Humanidade = Consciência + Autocontrole. Força de Vontade inicial = Coragem.
- Trilhas substituem Humanidade com Virtudes alternativas (Convicção, Instinto).
- Geração determina máximo de Pontos de Sangue e poder vampírico.
- Clãs: Assamita, Brujah, Gangrel, Giovanni, Lasombra, Malkaviano, Nosferatu, Ravnos, Seguidores de Set, Toreador, Tremere, Tzimisce, Ventrue, Caitiff.
- Seitas: Camarilla (ordem), Sabá (liberdade bestial), Independentes, Autarcas.
"""

def build_char_context(char: Optional[CharacterSheet]) -> str:
    """Monta um bloco de texto com o estado atual da ficha."""
    if not char or (not char.name and not char.clan):
        return ""

    lines = ["\n[Ficha do Personagem Atual]"]
    if char.name:      lines.append(f"Nome: {char.name}")
    if char.player:    lines.append(f"Jogador: {char.player}")
    if char.clan:      lines.append(f"Clã: {char.clan}")
    if char.path:      lines.append(f"Trilha/Humanidade: {char.path}")
    if char.generation:lines.append(f"Geração: {char.generation}ª")
    if char.nature:    lines.append(f"Natureza: {char.nature}")
    if char.behavior:  lines.append(f"Comportamento: {char.behavior}")

    if char.humanity is not None:  lines.append(f"Humanidade: {char.humanity}")
    if char.willpower is not None: lines.append(f"Força de Vontade: {char.willpower}")
    if char.blood_pts is not None: lines.append(f"Pontos de Sangue: {char.blood_pts}")

    if char.attrs:
        top_attrs = sorted(char.attrs.items(), key=lambda x: -x[1])[:5]
        lines.append("Atributos principais: " + ", ".join(f"{k}({v})" for k,v in top_attrs))

    if char.skills:
        active = [(k,v) for k,v in char.skills.items() if v > 0]
        active.sort(key=lambda x: -x[1])
        lines.append("Habilidades: " + ", ".join(f"{k}({v})" for k,v in active[:8]))

    if char.disciplines:
        active_d = [(k,v) for k,v in char.disciplines.items() if v > 0]
        if active_d:
            lines.append("Disciplinas: " + ", ".join(f"{k}({v})" for k,v in active_d))

    return "\n".join(lines)


# ── routes ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
def root():
    return {"status": "online", "service": "Vampiro v20 AI Assistant"}


@app.post("/chat", response_model=ChatResponse, tags=["ai"])
async def chat(req: ChatRequest):
    """
    Envia uma mensagem para o assistente de IA.
    Inclua o histórico da conversa e opcionalmente a ficha do personagem.
    """
    if not ANTHROPIC_API_KEY:
        raise HTTPException(503, "ANTHROPIC_API_KEY não configurada no servidor.")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    char_context = build_char_context(req.character)
    full_message = req.message + char_context

    messages = [{"role": m.role, "content": m.content} for m in req.history]
    messages.append({"role": "user", "content": full_message})

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
    except anthropic.AuthenticationError:
        raise HTTPException(401, "Chave de API inválida.")
    except anthropic.RateLimitError:
        raise HTTPException(429, "Limite de requisições atingido. Tente novamente em instantes.")
    except Exception as e:
        raise HTTPException(500, f"Erro ao chamar a API: {str(e)}")

    reply  = "".join(b.text for b in response.content if b.type == "text")
    tokens = response.usage.input_tokens + response.usage.output_tokens

    return ChatResponse(reply=reply, tokens=tokens)


@app.post("/dice", response_model=DiceResponse, tags=["game"])
def roll_dice(req: DiceRequest):
    """
    Rola um pool de dados d10 e retorna o resultado com interpretação.
    """
    import random
    rolls = [random.randint(1, 10) for _ in range(req.pool)]
    successes = sum(1 for r in rolls if r >= req.difficulty)
    ones      = sum(1 for r in rolls if r == 1)
    net       = successes - ones
    botch     = successes == 0 and ones > 0

    if botch:          result, verdict = "botch",      "💀 Falha Crítica — algo deu muito errado!"
    elif net <= 0:     result, verdict = "fail",       "✗ Falha — a ação não teve sucesso."
    elif net == 1:     result, verdict = "success",    "✓ Sucesso Mínimo — funciona, mas por pouco."
    elif net <= 2:     result, verdict = "success",    "✓✓ Sucesso Moderado — resultado satisfatório."
    elif net <= 4:     result, verdict = "exceptional","✓✓✓ Sucesso Total — excelente resultado!"
    else:              result, verdict = "exceptional","✓✓✓✓ Sucesso Fenomenal — obra-prima!"

    return DiceResponse(
        rolls=rolls, successes=net, ones=ones,
        botch=botch, result=result, verdict=verdict
    )


@app.post("/analyze", tags=["ai"])
async def analyze_sheet(req: SheetAnalysis):
    """
    Analisa a ficha do personagem e retorna sugestões e observações.
    """
    if not ANTHROPIC_API_KEY:
        raise HTTPException(503, "ANTHROPIC_API_KEY não configurada.")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    char = req.character
    char_ctx = build_char_context(char)

    prompt = f"""Analise esta ficha de personagem de Vampiro: A Máscara e forneça:
1. Uma avaliação do personagem (pontos fortes e fracos)
2. Sugestões de Disciplinas ou Habilidades para desenvolver com XP
3. Dicas de roleplay baseadas no Clã e Trilha/Humanidade
4. Alertas sobre problemas mecânicos (se houver)
Foco da análise: {req.focus}
{char_ctx}"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1200,
        system=SYSTEM_PROMPT,
        messages=[{"role":"user","content":prompt}],
    )
    reply = "".join(b.text for b in response.content if b.type == "text")
    return {"analysis": reply, "tokens": response.usage.input_tokens + response.usage.output_tokens}


@app.post("/preludio", tags=["ai"])
async def generate_preludio(character: CharacterSheet):
    """
    Gera um prelúdio narrativo (história de Abraço) para o personagem.
    """
    if not ANTHROPIC_API_KEY:
        raise HTTPException(503, "ANTHROPIC_API_KEY não configurada.")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    char_ctx = build_char_context(character)

    prompt = f"""Crie um prelúdio dramático e atmosférico para este personagem — a noite do seu Abraço.
Inclua: a vida mortal antes, o encontro com o Senhor, o Abraço em si e os primeiros momentos como vampiro.
Tom: gótico, pessoal, emocional. 3-4 parágrafos. Em segunda pessoa ("Você estava...").
{char_ctx}"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=800,
        system=SYSTEM_PROMPT,
        messages=[{"role":"user","content":prompt}],
    )
    reply = "".join(b.text for b in response.content if b.type == "text")
    return {"preludio": reply}


# ── dev server ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"\n🩸 Vampiro AI Backend rodando em http://localhost:{port}")
    print(f"   Docs: http://localhost:{port}/docs\n")
    uvicorn.run("api.main:app", host="0.0.0.0", port=port, reload=True)
