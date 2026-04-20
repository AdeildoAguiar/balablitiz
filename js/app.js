/* =============================================
   VAMPIRO: A MÁSCARA — APP LOGIC & RENDERING
   js/app.js
   ============================================= */

'use strict';

/* ==================== NAVIGATION ==================== */
function goStep(n) {
  document.querySelectorAll('.section-panel').forEach(s => s.classList.remove('is-active'));
  document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('is-active'));
  el('step' + n).classList.add('is-active');
  el('stepBtn' + n).classList.add('is-active');
  state.step = n;
  el('progressFill').style.width = (n / 6 * 100) + '%';
  if (n === 5) { renderDerived(); renderHumanityScale(); renderGenTable(); }
  if (n === 6) renderFinalSheet();
  window.scrollTo(0, 0);
  updateContext();
}

/* ==================== STEP 1: CLANS ==================== */
function renderClans() {
  el('clanGrid').innerHTML = Object.entries(CLANS).map(([id, c]) =>
    `<div class="clan-card ${state.clan === id ? 'is-selected' : ''}" id="clan-${id}" onclick="selectClan('${id}')">
      <span class="clan-card__icon">${c.icon}</span>
      <div class="clan-card__name">${c.name}</div>
      <div class="clan-card__nick">${c.nick}</div>
    </div>`
  ).join('');
}

function selectClan(id) {
  state.clan = id;
  document.querySelectorAll('.clan-card').forEach(c => c.classList.remove('is-selected'));
  el('clan-' + id).classList.add('is-selected');
  const c   = CLANS[id];
  const det = el('clanDetail');
  det.className = 'clan-detail is-visible';
  det.innerHTML = `
    <div class="clan-detail__title">${c.icon} ${c.name} — ${c.nick}</div>
    <div class="clan-detail__grid">
      <div class="clan-detail__field"><strong>Seita</strong><span>${c.seita}</span></div>
      <div class="clan-detail__field"><strong>Atributo foco</strong><span>${c.attrFocus}</span></div>
      <div class="clan-detail__field"><strong>Disciplinas nativas</strong><span>${c.disc.join(' · ')}</span></div>
      <div class="clan-detail__field"><strong>Bom para</strong><span>${c.bestFor}</span></div>
    </div>
    <div class="clan-weakness">
      <span class="clan-weakness__label">⚠ Fraqueza do Clã</span>
      ${escHtml(c.weakness)}
    </div>`;
  renderDiscGrid();
  updateContext();
}

/* ==================== STEP 2: ATTRIBUTES ==================== */
function setPriority(type, group) {
  const arr    = type === 'attr' ? state.attrPriority : state.skillPriority;
  const idx    = arr.indexOf(group);
  if (idx >= 0) arr.splice(idx, 1);
  else if (arr.length < 3) arr.push(group);

  const pts    = type === 'attr' ? ATTR_PRIORITY_PTS : SKILL_PRIORITY_PTS;
  const prefix = type === 'attr' ? 'ap' : 'sp';
  const labels = ['is-primary', 'is-secondary', 'is-tertiary'];

  ['physical', 'social', 'mental', 'talents', 'pericias', 'knowledge'].forEach(g => {
    const box = el(prefix + '-' + g);
    if (!box) return;
    box.classList.remove('is-primary', 'is-secondary', 'is-tertiary');
    const i = arr.indexOf(g);
    if (i >= 0) {
      box.classList.add(labels[i]);
      const ptsEl = el(prefix + '-pts-' + g);
      if (ptsEl) ptsEl.textContent = '+' + pts[i] + ' pts';
    } else {
      const ptsEl = el(prefix + '-pts-' + g);
      if (ptsEl) ptsEl.textContent = '?';
    }
  });

  if (type === 'attr')  renderAllAttrs();
  if (type === 'skill') renderAllSkills();
}

function renderAttrGroup(containerId, attrs, infoId, group) {
  const c = el(containerId);
  if (!c) return;
  const used = attrs.reduce((s, a) => s + state.attrs[a] - 1, 0);
  const idx  = state.attrPriority.indexOf(group);
  const max  = idx >= 0 ? ATTR_PRIORITY_PTS[idx] : '?';
  if (el(infoId)) el(infoId).textContent = `gastos: ${used} / ${max}`;

  c.innerHTML = attrs.map(a => {
    const v        = state.attrs[a];
    const disabled = a === 'Aparência' && state.clan === 'nosferatu';
    return `<div class="dot-row">
      <span class="dot-row__label">${a}</span>
      <div class="dots">
        ${Array.from({ length: 5 }, (_, i) => {
          const f  = v > i ? ' is-filled' : '';
          const d  = disabled ? ' is-disabled' : '';
          const fn = disabled ? '' : ` onclick="setAttr('${a}',${i + 1})"`;
          return `<div class="dot${f}${d}"${fn}></div>`;
        }).join('')}
      </div>
      ${disabled ? '<span class="dot-row__note">(sempre 0)</span>' : ''}
    </div>`;
  }).join('');
}

function renderAllAttrs() {
  renderAttrGroup('attrs-physical', ATTRS_PHYSICAL, 'phys-info', 'physical');
  renderAttrGroup('attrs-social',   ATTRS_SOCIAL,   'soc-info',  'social');
  renderAttrGroup('attrs-mental',   ATTRS_MENTAL,   'ment-info', 'mental');
}

function setAttr(attr, val) {
  const cur = state.attrs[attr];
  state.attrs[attr] = cur === val ? Math.max(1, val - 1) : val;
  renderAllAttrs();
}

/* ==================== STEP 3: SKILLS ==================== */
function renderSkillGroup(containerId, skills, infoId, group) {
  const c = el(containerId);
  if (!c) return;
  const used = skills.reduce((s, k) => s + state.skills[k], 0);
  const idx  = state.skillPriority.indexOf(group);
  const max  = idx >= 0 ? SKILL_PRIORITY_PTS[idx] : '?';
  if (el(infoId)) el(infoId).textContent = `gastos: ${used} / ${max}`;

  c.innerHTML = skills.map(s => {
    const v = state.skills[s];
    return `<div class="dot-row">
      <span class="dot-row__label">${s}</span>
      <div class="dots">
        ${Array.from({ length: 5 }, (_, i) =>
          `<div class="dot${v > i ? ' is-filled' : ''}" onclick="setSkill('${s}',${i + 1})"></div>`
        ).join('')}
      </div>
    </div>`;
  }).join('');
}

function renderAllSkills() {
  renderSkillGroup('skills-talents',  SKILLS_TALENTS,  'tal-info', 'talents');
  renderSkillGroup('skills-pericias', SKILLS_PERICIAS, 'per-info', 'pericias');
  renderSkillGroup('skills-know',     SKILLS_KNOW,     'kno-info', 'knowledge');
}

function setSkill(skill, val) {
  const cur = state.skills[skill];
  state.skills[skill] = cur === val ? Math.max(0, val - 1) : val;
  renderAllSkills();
}

/* ==================== STEP 4: DISCIPLINES ==================== */
function renderDiscGrid() {
  const c = el('discGrid');
  if (!c) return;
  const clan      = state.clan ? CLANS[state.clan] : null;
  const clanDiscs = clan ? clan.disc : [];
  const allDiscs  = [...new Set([...clanDiscs, ...Object.keys(DISCIPLINES)])];

  c.innerHTML = allDiscs.map(d => {
    const isClan = clanDiscs.includes(d);
    const v      = state.disciplines[d] || 0;
    return `<div class="disc-card ${isClan ? 'is-clan' : ''}">
      <div class="disc-card__header">
        <span class="disc-card__name">${d}</span>
        ${isClan ? '<span class="disc-card__badge">Clã</span>' : ''}
      </div>
      <div class="disc-card__desc">${DISCIPLINES[d]}</div>
      <div class="dots" style="margin-top:0.45rem">
        ${Array.from({ length: 3 }, (_, i) =>
          `<div class="dot${v > i ? ' is-filled' : ''}" onclick="setDisc('${d}',${i + 1})"></div>`
        ).join('')}
      </div>
    </div>`;
  }).join('');
}

function setDisc(d, val) {
  state.disciplines[d] = state.disciplines[d] === val ? Math.max(0, val - 1) : val;
  renderDiscGrid();
}

/* ==================== STEP 4: BACKGROUNDS ==================== */
function renderBackgrounds() {
  const c     = el('bgList');
  if (!c) return;
  const total = Object.values(state.backgrounds).reduce((a, b) => a + b, 0);
  const rem   = 5 - total;
  const cnt   = el('bgPtsCount');
  if (cnt) {
    cnt.textContent = rem;
    cnt.className   = 'points-bar__count' + (rem < 0 ? ' is-over' : rem === 0 ? ' is-done' : '');
  }
  c.innerHTML = BACKGROUNDS.map(bg => {
    const v = state.backgrounds[bg];
    return `<div class="bg-row">
      <span class="bg-row__name">${bg}</span>
      <div class="dots">
        ${Array.from({ length: 5 }, (_, i) =>
          `<div class="dot${v > i ? ' is-filled' : ''}" onclick="setBg('${bg}',${i + 1})"></div>`
        ).join('')}
      </div>
      <span class="bg-row__val">${v}</span>
    </div>`;
  }).join('');
}

function setBg(bg, val) {
  state.backgrounds[bg] = state.backgrounds[bg] === val ? Math.max(0, val - 1) : val;
  renderBackgrounds();
}

/* ==================== STEP 4: VIRTUES ==================== */
function renderVirtues() {
  const c    = el('virtueList');
  if (!c) return;
  const path     = PATHS[state.path];
  const useAlt   = path && !path.isHumanity;
  const virtList = useAlt ? VIRTUES_PATHS : VIRTUES_HUMAN;

  c.innerHTML = virtList.map(v => {
    const val = state.virtues[v.id] || 0;
    return `<div class="virtue-card">
      <div class="virtue-card__top">
        <div class="virtue-card__info">
          <div class="virtue-card__name">${v.name}</div>
          <div class="virtue-card__desc">${v.desc}</div>
        </div>
        <div class="dots">
          ${Array.from({ length: 5 }, (_, i) =>
            `<div class="dot${val > i ? ' is-filled' : ''}" onclick="setVirtue('${v.id}',${i + 1})"></div>`
          ).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

function setVirtue(id, val) {
  const cur = state.virtues[id] || 0;
  state.virtues[id] = cur === val ? Math.max(1, val - 1) : val;
  renderVirtues();
  renderDerived();
}

/* ==================== STEP 5: PATHS ==================== */
function renderPathSelector() {
  const c = el('pathSelector');
  if (!c) return;
  c.innerHTML = Object.entries(PATHS).map(([id, p]) =>
    `<div class="path-card ${state.path === id ? 'is-selected' : ''}" id="path-${id}" onclick="selectPath('${id}')">
      <div class="path-card__name">${p.name}</div>
      <div class="path-card__nick">${p.nick !== '—' ? p.nick : 'Padrão'}</div>
      <div class="path-card__virtues">
        <strong>Virtudes</strong>${p.virtues.join(' · ')}
      </div>
    </div>`
  ).join('');
}

function selectPath(id) {
  state.path = id;
  document.querySelectorAll('.path-card').forEach(c => c.classList.remove('is-selected'));
  el('path-' + id).classList.add('is-selected');
  const p   = PATHS[id];
  const det = el('pathDetail');
  if (det) {
    det.className = 'path-detail is-visible';
    det.innerHTML = `
      <div class="path-detail__title">${p.name} — ${p.nick}</div>
      <div class="path-detail__beliefs">${escHtml(p.beliefs)}</div>
      <table class="path-sin-table">
        <thead><tr><th>Nível</th><th>Hierarquia de Pecados</th></tr></thead>
        <tbody>${p.sins.map(([n, s]) => `<tr><td>${n}</td><td>${escHtml(s)}</td></tr>`).join('')}</tbody>
      </table>`;
  }
  renderVirtues();
  renderDerived();
}

/* ==================== STEP 5: DERIVED STATS ==================== */
function renderDerived() {
  const c = el('derivedStats');
  if (!c) return;
  const d      = getDerived();
  const hScale = HUMANITY_SCALE.find(([n]) => n === d.humanity);
  const hLabel = hScale ? hScale[1] : '';
  c.innerHTML = `
    <div class="derived-stat derived-stat--humanity">
      <span class="derived-stat__value">${d.humanity}</span>
      <span class="derived-stat__label">Humanidade<br><small style="font-size:0.62rem;font-style:italic">${hLabel}</small></span>
    </div>
    <div class="derived-stat derived-stat--willpower">
      <span class="derived-stat__value">${d.willpower}</span>
      <span class="derived-stat__label">Força de Vontade</span>
    </div>
    <div class="derived-stat derived-stat--blood">
      <span class="derived-stat__value">${d.bloodPts}</span>
      <span class="derived-stat__label">Pts. de Sangue</span>
    </div>`;
}

function renderHumanityScale() {
  const c = el('humanityScale');
  if (!c) return;
  const d = getDerived();
  c.innerHTML = HUMANITY_SCALE.map(([n, name, eff]) =>
    `<div class="humanity-level ${d.humanity === n ? 'is-current' : ''}">
      <span class="humanity-level__num">${n}</span>
      <span class="humanity-level__name">${name}</span>
      <span class="humanity-level__effects">${eff}</span>
    </div>`
  ).join('');
}

function renderGenTable() {
  const c      = el('genTable');
  if (!c) return;
  const selGen = parseInt(state.generation);
  c.innerHTML  = `<table class="gen-table">
    <thead><tr><th>Geração</th><th>Pts. Sangue</th><th>Atrib. Max</th><th>Nota</th></tr></thead>
    <tbody>
      ${GEN_TABLE.map(r => `
        <tr style="${r.gen === selGen ? 'background:rgba(201,168,76,0.08)' : ''}">
          <td>${r.gen}ª</td><td>${r.pts}</td><td>${r.maxAttr}</td>
          <td style="color:var(--muted);font-style:italic">${r.note}</td>
        </tr>`
      ).join('')}
    </tbody>
  </table>`;
}

/* ==================== DICE ROLLER ==================== */
function rollDice() {
  const pool = parseInt(el('dicePool')?.value || 3);
  const diff = parseInt(el('diceDiff')?.value || 6);
  if (pool < 1 || pool > 20) { showToast('Pool entre 1 e 20'); return; }

  const rolls     = Array.from({ length: pool }, () => Math.ceil(Math.random() * 10));
  const successes = rolls.filter(r => r >= diff).length;
  const ones      = rolls.filter(r => r === 1).length;
  const botch     = successes === 0 && ones > 0;
  const c         = el('diceResult');
  if (!c) return;

  let verdict, verdictColor;
  if (botch)            { verdict = '💀 FALHA CRÍTICA';     verdictColor = 'var(--blood-light)'; }
  else if (!successes)  { verdict = '✗ Falha';              verdictColor = 'var(--muted)'; }
  else if (successes === 1) { verdict = '✓ Sucesso mínimo'; verdictColor = 'var(--green-ok)'; }
  else if (successes <= 2)  { verdict = '✓✓ Sucesso moderado'; verdictColor = 'var(--green-ok)'; }
  else                  { verdict = '✓✓✓ Sucesso total!';   verdictColor = '#8ede8e'; }

  c.innerHTML = `
    <div class="dice-row" style="margin-bottom:0.75rem">
      ${rolls.map(r => {
        const cls = r === 1 ? 'is-botch' : r >= diff ? 'is-success' : 'is-fail';
        return `<div class="die ${cls}">${r}</div>`;
      }).join('')}
    </div>
    <div style="font-family:var(--font-display);font-size:1rem;color:${verdictColor}">${verdict}</div>
    <div style="font-size:0.8rem;color:var(--muted);margin-top:0.3rem">
      ${successes} sucesso(s) · ${ones} um(s) · dificuldade ${diff}
    </div>`;

  state.diceHistory.unshift({ pool, diff, rolls, successes, botch, time: new Date().toLocaleTimeString('pt-BR') });
}

/* ==================== STEP 6: FINAL SHEET ==================== */
function renderFinalSheet() {
  const c = el('fichaFinal');
  if (!c) return;
  const d    = getDerived();
  const clan = state.clan ? CLANS[state.clan] : null;
  const path = PATHS[state.path];

  const attrSection = (title, attrs) => `
    <div class="ficha-section">
      <div class="ficha-section__title">${title}</div>
      ${attrs.map(a => `
        <div class="ficha-row">
          <span class="ficha-row__label">${a}</span>
          ${fichaDotsHtml(state.attrs[a])}
        </div>`).join('')}
    </div>`;

  const skillSection = (title, skills) => {
    const active = skills.filter(s => state.skills[s] > 0);
    if (!active.length) {
      return `<div class="ficha-section">
        <div class="ficha-section__title">${title}</div>
        <div style="font-size:0.8rem;color:var(--ink-light);font-style:italic">Nenhuma</div>
      </div>`;
    }
    return `<div class="ficha-section">
      <div class="ficha-section__title">${title}</div>
      ${active.map(s => `
        <div class="ficha-row">
          <span class="ficha-row__label">${s}</span>
          ${fichaDotsHtml(state.skills[s])}
        </div>`).join('')}
    </div>`;
  };

  const virtues    = path.isHumanity ? VIRTUES_HUMAN : VIRTUES_PATHS;
  const activeBgs  = BACKGROUNDS.filter(b => state.backgrounds[b] > 0);
  const activeDiscs= Object.entries(state.disciplines).filter(([, v]) => v > 0);

  c.innerHTML = `<div class="ficha-sheet">
    <div class="ficha-header">
      <div class="ficha-header__title">🩸 Vampiro: A Máscara</div>
      <div class="ficha-header__sub">Edição de 20º Aniversário — Ficha de Personagem</div>
    </div>

    <div class="ficha-3col" style="margin-bottom:1.4rem">
      <div class="ficha-section">
        <div class="ficha-section__title">Identidade</div>
        <div class="ficha-row"><span class="ficha-row__label">Nome</span><strong>${escHtml(state.name || '—')}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Jogador</span><strong>${escHtml(state.player || '—')}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Clã</span><strong>${clan ? clan.name : '—'}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Geração</span><strong>${state.generation}ª</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Conceito</span><strong style="font-size:0.82rem">${escHtml(state.concept || '—')}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Natureza</span><strong style="font-size:0.82rem">${escHtml((state.nature || '—').split(' — ')[0])}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Comportamento</span><strong>${escHtml(state.behavior || '—')}</strong></div>
      </div>

      <div class="ficha-section">
        <div class="ficha-section__title">Valores Derivados</div>
        <div class="ficha-row"><span class="ficha-row__label">${path.name}</span>${fichaDotsHtml(d.humanity)}</div>
        <div class="ficha-row"><span class="ficha-row__label">Força de Vontade</span>${fichaDotsHtml(d.willpower)}</div>
        <div class="ficha-row"><span class="ficha-row__label">Pontos de Sangue</span><strong>${d.bloodPts}</strong></div>
        ${clan ? `
          <div class="ficha-section__title" style="margin-top:0.9rem">Disciplinas do Clã</div>
          ${clan.disc.map(dc => `
            <div class="ficha-row">
              <span class="ficha-row__label">${dc}</span>
              ${fichaDotsHtml(state.disciplines[dc] || 0)}
            </div>`).join('')}` : ''}
      </div>

      <div class="ficha-section">
        <div class="ficha-section__title">Virtudes</div>
        ${virtues.map(v => `
          <div class="ficha-row">
            <span class="ficha-row__label">${v.name}</span>
            ${fichaDotsHtml(state.virtues[v.id] || 0)}
          </div>`).join('')}
        ${activeBgs.length ? `
          <div class="ficha-section__title" style="margin-top:0.9rem">Antecedentes</div>
          ${activeBgs.map(b => `
            <div class="ficha-row">
              <span class="ficha-row__label">${b}</span>
              ${fichaDotsHtml(state.backgrounds[b])}
            </div>`).join('')}` : ''}
      </div>
    </div>

    <div class="ficha-3col" style="margin-bottom:1.4rem">
      ${attrSection('Atributos Físicos', ATTRS_PHYSICAL)}
      ${attrSection('Atributos Sociais', ATTRS_SOCIAL)}
      ${attrSection('Atributos Mentais', ATTRS_MENTAL)}
    </div>

    <div class="ficha-3col" style="margin-bottom:1.4rem">
      ${skillSection('Talentos',       SKILLS_TALENTS)}
      ${skillSection('Perícias',       SKILLS_PERICIAS)}
      ${skillSection('Conhecimentos',  SKILLS_KNOW)}
    </div>

    ${activeDiscs.length ? `
      <div class="ficha-section">
        <div class="ficha-section__title">Todas as Disciplinas</div>
        <div class="ficha-3col">
          ${activeDiscs.map(([d, v]) => `
            <div class="ficha-row">
              <span class="ficha-row__label">${d}</span>
              ${fichaDotsHtml(v)}
            </div>`).join('')}
        </div>
      </div>` : ''}

    ${state.qualities ? `
      <div class="ficha-section">
        <div class="ficha-section__title">Qualidades e Defeitos</div>
        <div style="font-size:0.9rem;color:var(--ink-light);font-style:italic">${escHtml(state.qualities)}</div>
      </div>` : ''}

    ${state.history ? `
      <div class="ficha-section">
        <div class="ficha-section__title">História de Fundo</div>
        <div style="font-size:0.88rem;color:var(--ink-light);line-height:1.7">${escHtml(state.history)}</div>
      </div>` : ''}
  </div>`;
}

/* ==================== RENDER ALL (used by loadChar) ==================== */
function renderAll() {
  renderClans();
  renderAllAttrs();
  renderAllSkills();
  renderDiscGrid();
  renderBackgrounds();
  renderVirtues();
  renderDerived();
  renderHumanityScale();
  renderGenTable();
  renderPathSelector();
  if (state.path) selectPath(state.path);
  if (state.clan) selectClan(state.clan);
}

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  updateContext();
});
