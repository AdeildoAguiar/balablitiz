/* =============================================
   VAMPIRO: A MÁSCARA — AI ASSISTANT MODULE
   ai.js
   ============================================= */

'use strict';

const AI_SYSTEM = `Você é um assistente especialista e narrador veterano de Vampiro: A Máscara (Edição de 20º Aniversário, White Wolf / Onyx Path Publishing).

REGRAS DE COMPORTAMENTO:
- Responda SEMPRE em português brasileiro, com vocabulário da obra original traduzida.
- Use a terminologia correta: Narrador (não Mestre), Membros/Cainitas (vampiros), Abraço, Vitae, Besta, Máscara, Jyhad, Gehenna, Golconda, frenesi, torpor, diablerie.
- Seja didático e preciso — explique como se fosse um veterano ensinando iniciantes.
- Respostas curtas e diretas: máximo 3 parágrafos por mensagem.
- Quando relevante, use exemplos práticos de mesa.
- Se a pergunta envolver a ficha do jogador, use as informações do contexto fornecidas.

CONTEXTO DO SISTEMA:
- Dados das Trilhas da Sabedoria: Humanidade (padrão), Trilha do Sangue, Trilha dos Ossos, Trilha de Caim, Trilha da Noite, Trilha do Paraíso.
- Virtudes: Consciência/Convicção (degeneração), Autocontrole/Instinto (frenesi), Coragem (medo/pânico).
- Humanidade = Consciência + Autocontrole (ou equivalente da Trilha). Força de Vontade = Coragem.
- Sistema de dados: d10 pool. Atributo + Habilidade = número de dados. Cada resultado ≥ dificuldade (padrão 6) = 1 sucesso.
- Falha crítica (botch): zero sucessos e pelo menos um resultado "1".
- Geração determina Pontos de Sangue máximos e poder do vampiro.`;

const aiHistory = [];
let aiIsLoading = false;

function getAIContext() {
  if (!window.__charContext) return '';
  const ctx = window.__charContext;
  if (!ctx.name && !ctx.clan) return '';
  return `\n\n[Contexto da Ficha Atual]\nPersonagem: ${ctx.name||'sem nome'} | Clã: ${ctx.clan||'não escolhido'} | Trilha: ${ctx.path||'Humanidade'} | Humanidade: ${ctx.humanity} | FdV: ${ctx.willpower} | Pts. Sangue: ${ctx.bloodPts}${ctx.clan ? `\nDisciplinas: ${Object.entries(ctx.disciplines||{}).map(([d,v])=>d+'('+v+')').join(', ')||'nenhuma'}` : ''}`;
}

async function sendAI() {
  if (aiIsLoading) return;
  const inp = document.getElementById('aiInput');
  const msg = inp?.value?.trim();
  if (!msg) return;
  inp.value = '';
  inp.style.height = '';

  addMsg('user', msg);
  aiHistory.push({ role:'user', content: msg + getAIContext() });

  aiIsLoading = true;
  setStatus(true);
  const loadId = addLoading();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: AI_SYSTEM,
        messages: aiHistory.map(m => ({ role:m.role, content:m.content }))
      })
    });

    removeLoading(loadId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data.content?.map(b => b.text||'').join('') || 'Sem resposta.';
    addMsg('assistant', reply);
    aiHistory.push({ role:'assistant', content: reply });
    if (aiHistory.length > 24) aiHistory.splice(0, 2);

  } catch (e) {
    removeLoading(loadId);
    addMsg('assistant', `⚠ Erro: ${e.message}. Verifique a conexão e tente novamente.`);
  } finally {
    aiIsLoading = false;
    setStatus(false);
  }
}

function askQuick(q) {
  const inp = document.getElementById('aiInput');
  if (inp) inp.value = q;
  sendAI();
}

function aiKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAI();
  }
}

function addMsg(role, text) {
  const container = document.getElementById('aiMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `ai-msg ai-msg--${role}`;
  const label = role === 'assistant' ? '🩸 Assistente' : '👤 Você';
  div.innerHTML = `<span class="ai-msg__label">${label}</span>${formatMsgText(text)}`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function formatMsgText(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function addLoading() {
  const container = document.getElementById('aiMessages');
  if (!container) return null;
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg--assistant';
  const id = 'loading-' + Date.now();
  div.id = id;
  div.innerHTML = `<span class="ai-msg__label">🩸 Assistente</span>
    <div class="ai-typing">
      <div class="ai-typing__dot"></div>
      <div class="ai-typing__dot"></div>
      <div class="ai-typing__dot"></div>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeLoading(id) {
  if (id) document.getElementById(id)?.remove();
}

function setStatus(loading) {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusTxt');
  if (dot) dot.className = 'status-dot' + (loading ? ' is-loading' : '');
  if (txt) txt.textContent = loading ? 'Pensando...' : 'Online';
}

function clearChat() {
  aiHistory.length = 0;
  const c = document.getElementById('aiMessages');
  if (c) c.innerHTML = `<div class="ai-msg ai-msg--assistant">
    <span class="ai-msg__label">🩸 Assistente</span>
    Conversa reiniciada. Como posso ajudar?
  </div>`;
}
