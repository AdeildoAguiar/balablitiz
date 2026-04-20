/* =============================================
   VAMPIRO: A MÁSCARA — STATE & HELPERS
   js/state.js
   ============================================= */

'use strict';

/* ==================== APP STATE ==================== */
const state = {
  step: 1,
  name: '', player: '', concept: '', nature: '', behavior: '', history: '', qualities: '',
  clan: null,
  generation: 13,
  path: 'humanidade',
  attrPriority:  [],  // ['physical','social','mental'] in chosen order
  skillPriority: [],
  attrs:       {},
  skills:      {},
  disciplines: {},
  backgrounds: {},
  virtues: { consciencia: 1, autocontrole: 1, coragem: 1, conviccao: 0, instinto: 0 },
  diceHistory: [],
};

// Initialise all attributes to 1, skills/disciplines/backgrounds to 0
[...ATTRS_PHYSICAL, ...ATTRS_SOCIAL, ...ATTRS_MENTAL].forEach(a => state.attrs[a] = 1);
[...SKILLS_TALENTS, ...SKILLS_PERICIAS, ...SKILLS_KNOW].forEach(s => state.skills[s] = 0);
Object.keys(DISCIPLINES).forEach(d => state.disciplines[d] = 0);
BACKGROUNDS.forEach(b => state.backgrounds[b] = 0);

/* ==================== HELPERS ==================== */
function el(id)  { return document.getElementById(id); }

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(msg, duration = 2600) {
  const t = el('toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  setTimeout(() => t.classList.remove('is-visible'), duration);
}

function fichaDotsHtml(val, max = 5) {
  return `<div class="ficha-dots">` +
    Array.from({ length: max }, (_, i) =>
      `<div class="ficha-dot ${i < val ? 'is-filled' : ''}"></div>`
    ).join('') +
  '</div>';
}

/* ==================== DERIVED STATS ==================== */
function getDerived() {
  const path = PATHS[state.path];
  let humBase;
  if (path && !path.isHumanity) {
    humBase = (state.virtues.conviccao || 0) + (state.virtues.autocontrole || 0);
  } else {
    humBase = (state.virtues.consciencia || 0) + (state.virtues.autocontrole || 0);
  }
  const humanity  = Math.min(10, humBase);
  const willpower = state.virtues.coragem || 1;
  const genRow    = GEN_TABLE.find(r => r.gen === parseInt(state.generation)) || GEN_TABLE[0];
  return { humanity, willpower, bloodPts: genRow.pts };
}

/* ==================== SYNC FORM → STATE ==================== */
function syncFormState() {
  state.name       = el('charName')?.value      || '';
  state.player     = el('playerName')?.value    || '';
  state.concept    = el('charConcept')?.value   || '';
  state.nature     = el('charNature')?.value    || '';
  state.behavior   = el('charBehavior')?.value  || '';
  state.generation = parseInt(el('charGen')?.value || '13');
  state.history    = el('charHistory')?.value   || '';
  state.qualities  = el('charQualities')?.value || '';
}

/* ==================== CONTEXT FOR AI ==================== */
function updateContext() {
  syncFormState();
  const clan = state.clan ? CLANS[state.clan] : null;
  const d    = getDerived();
  window.__charContext = {
    name:        state.name,
    clan:        clan?.name,
    path:        PATHS[state.path]?.name,
    humanity:    d.humanity,
    willpower:   d.willpower,
    bloodPts:    d.bloodPts,
    attrs:       state.attrs,
    skills:      state.skills,
    disciplines: Object.fromEntries(Object.entries(state.disciplines).filter(([, v]) => v > 0)),
    backgrounds: Object.fromEntries(Object.entries(state.backgrounds).filter(([, v]) => v > 0)),
    virtues:     state.virtues,
  };
}

/* ==================== SAVE / LOAD ==================== */
function saveChar() {
  syncFormState();
  const data = { version: 1, state: JSON.parse(JSON.stringify(state)) };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = (state.name || 'personagem').replace(/\s+/g, '_') + '_vampiro.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Ficha salva com sucesso!');
}

function loadChar(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.state) throw new Error('Formato inválido');
      Object.assign(state, data.state);
      renderAll();
      goStep(1);
      showToast('Ficha carregada!');
    } catch {
      showToast('Erro: arquivo inválido');
    }
  };
  reader.readAsText(file);
}
