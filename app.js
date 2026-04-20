/* =============================================
   VAMPIRO: A MÁSCARA — APP LOGIC
   app.js
   ============================================= */

'use strict';

/* ==================== GAME DATA ==================== */

const CLANS = {
  assamita:   { name:'Assamita',   nick:'Assassinos',      icon:'🗡️', seita:'Independente',        disc:['Rapidez','Ofuscação','Quietus'],          attrFocus:'Físico',        weakness:'Maldição Tremere: beber sangue de Membro causa dano letal automático por ponto drenado. Diablerie inflige dano agravado.', bestFor:'Assassinos, personagens furtivos e de ação' },
  brujah:     { name:'Brujah',     nick:'Ralé',             icon:'✊', seita:'Camarilla',            disc:['Rapidez','Potência','Presença'],           attrFocus:'Físico',        weakness:'Dificuldades de frenesi +2 acima do normal. Nunca pode gastar FdV para EVITAR o frenesi.', bestFor:'Guerreiros, rebeldes, personagens passionais' },
  gangrel:    { name:'Gangrel',    nick:'Forasteiros',      icon:'🐺', seita:'Camarilla (relutante)',disc:['Animalismo','Fortitude','Metamorfose'],    attrFocus:'Físico',        weakness:'A cada frenesi adquire uma característica animal permanente (física ou comportamental).', bestFor:'Sobreviventes, nômades, personagens ligados à natureza' },
  giovanni:   { name:'Giovanni',   nick:'Necromantes',      icon:'💀', seita:'Independente',        disc:['Dominação','Necromancia','Potência'],       attrFocus:'Social ou Mental',weakness:'O Beijo causa o dobro de dano letal em mortais; vítimas podem morrer de dor antes de serem drenadas.', bestFor:'Necromantes, manipuladores, personagens de intriga familiar' },
  lasombra:   { name:'Lasombra',   nick:'Guardiões',        icon:'🌑', seita:'Sabá',                 disc:['Dominação','Tenebrosidade','Potência'],    attrFocus:'Mental ou Social',weakness:'Não possuem reflexo em espelhos, água, vidro ou qualquer superfície polida. Não aparecem em fotos ou câmeras.', bestFor:'Líderes sombrios, fanatismo religioso, manipuladores' },
  malkaviano: { name:'Malkaviano', nick:'Lunáticos',        icon:'🌀', seita:'Camarilla',            disc:['Auspícios','Demência','Ofuscação'],        attrFocus:'Mental',        weakness:'Distúrbio mental permanente e incurável. Pode gastar FdV para suprimir por uma cena, nunca cura.', bestFor:'Jogadores experientes em roleplay; personagens únicos e visionários' },
  nosferatu:  { name:'Nosferatu',  nick:'Ratos de Esgoto',  icon:'🦇', seita:'Camarilla',            disc:['Animalismo','Ofuscação','Potência'],       attrFocus:'Físico e Mental',weakness:'Aparência permanentemente 0, nunca pode ser melhorada. Movem-se socialmente apenas com Ofuscação.', bestFor:'Espiões, coletores de segredos, personagens das sombras' },
  ravnos:     { name:'Ravnos',     nick:'Enganadores',      icon:'🎭', seita:'Independente',        disc:['Animalismo','Fortitude','Quimerismo'],     attrFocus:'Físico e Social',weakness:'Escravo de um vício específico. Ao ser tentado deve ceder a menos que passe em teste de Autocontrole dif. 6.', bestFor:'Trapaceiros, nômades, personagens caóticos e imprevisíveis' },
  setitas:    { name:'Seg. de Set',nick:'Setitas / Serpentes',icon:'🐍',seita:'Independente',       disc:['Ofuscação','Presença','Serpentis'],         attrFocus:'Mental e Social',weakness:'Luz intensa: +2 níveis de dano de saúde por exposição (soma-se ao dano solar normal).', bestFor:'Cultistas, sedutores, guardiões de segredos sombrios' },
  toreador:   { name:'Toreador',   nick:'Degenerados',      icon:'🌹', seita:'Camarilla',            disc:['Auspícios','Rapidez','Presença'],          attrFocus:'Social',        weakness:'Ao ver algo extraordinariamente belo, teste de Autocontrole dif. 6 ou fica paralisado pelo resto da cena.', bestFor:'Artistas, socialites, personagens políticos de alta sociedade' },
  tremere:    { name:'Tremere',    nick:'Feiticeiros',      icon:'🔮', seita:'Camarilla',            disc:['Auspícios','Dominação','Taumaturgia'],     attrFocus:'Mental',        weakness:'Laço de sangue se forma com apenas 2 doses (em vez de 3). Todos os novatos bebem do sangue dos anciões.', bestFor:'Feiticeiros de sangue, estrategistas arcanos, personagens de hierarquia rígida' },
  tzimisce:   { name:'Tzimisce',   nick:'Demônios',         icon:'🩸', seita:'Sabá',                 disc:['Animalismo','Auspícios','Vicissitude'],    attrFocus:'Físico ou Mental',weakness:'Deve descansar com dois punhados de terra natal. Cada noite sem isso reduz todos os pools pela metade, cumulativamente.', bestFor:'Horror corporal, vilões, personagens completamente alienígenas à humanidade' },
  ventrue:    { name:'Ventrue',    nick:'Sangue Azul',      icon:'👑', seita:'Camarilla',            disc:['Dominação','Fortitude','Presença'],        attrFocus:'Social e Mental',weakness:'Alimenta-se apenas de um tipo específico de sangue mortal (decidido na criação). Outros tipos são regurgitados.', bestFor:'Líderes, aristocratas, personagens políticos e corporativos' }
};

const DISCIPLINES = {
  'Animalismo':   'Controle de animais e da Besta interior',
  'Auspícios':    'Percepção extra-sensorial e premonições',
  'Demência':     'Inflige loucura em outras mentes',
  'Dominação':    'Controle mental absoluto pelo olhar',
  'Fortitude':    'Resistência sobrenatural, inclusive ao sol',
  'Metamorfose':  'Transformação: garras, névoa, animais',
  'Necromancia':  'Invocar e controlar os mortos',
  'Ofuscação':    'Invisibilidade sobrenatural',
  'Potência':     'Força física sobrenatural',
  'Presença':     'Fascinar e controlar multidões',
  'Quietus':      'Arte do assassinato vampírico',
  'Quimerismo':   'Ilusões e alucinações convincentes',
  'Rapidez':      'Velocidade e reflexos sobrenaturais',
  'Serpentis':    'Poderes reptilianos e fascínio setita',
  'Taumaturgia':  'Feitiçaria do sangue — poder arcano',
  'Tenebrosidade':'Controle sobrenatural das sombras',
  'Vicissitude':  'Moldar carne e osso à vontade'
};

const PATHS = {
  humanidade: {
    name:'Humanidade', nick:'—', virtues:['Consciência','Autocontrole','Coragem'], isHumanity: true,
    beliefs:'O caminho padrão de todos os vampiros recém-Abraçados. Quanto mais alta, mais o vampiro mantém sua natureza mortal e consegue se passar por humano. Vampiros com Humanidade alta sentem remorso, hesitam antes de matar e resistem melhor à Besta.',
    sins:[
      [10,'Pensamentos egoístas'],
      [9,'Pequenos atos de egoísmo'],
      [8,'Ferir outrem (acidental ou não)'],
      [7,'Furto e roubo'],
      [6,'Violação acidental (beber fonte até secá-la por fome)'],
      [5,'Dano intencional à propriedade'],
      [4,'Violação por descontrole (matar fonte em frenesi)'],
      [3,'Violação premeditada (assassinato simples)'],
      [2,'Violação negligente (matar sem pensar)'],
      [1,'Os atos mais hediondos e perversos']
    ]
  },
  sangue: {
    name:'Trilha do Sangue', nick:'Dervixe', virtues:['Convicção','Autocontrole','Coragem'],
    beliefs:'Praticada quase que exclusivamente pelos Assamitas. Os filhos de Haqim não passam de falhas grotescas destinadas a aproximar as criaturas do "Primeiro", um estado de transcendência mística. Seguidores buscam diablerizar outros vampiros e converter os demais ao caminho de Haqim.',
    sins:[
      [10,'Matar um mortal para sustento (o sangue humano nutre o corpo, mas o assassinato de inferiores é veneno)'],
      [9,'Quebrar uma palavra dada a um companheiro de Clã'],
      [8,'Recusar-se a oferecer conversão a um não-Assamita'],
      [7,'Falhar em destruir um Membro impenitente de fora do Clã'],
      [6,'Sucumbir ao frenesi'],
      [5,'Falhar na busca pela sabedoria de Khayyin'],
      [4,'Falhar em exigir sangue como pagamento'],
      [3,'Recusar ajuda a um membro mais experiente da Trilha'],
      [2,'Falhar em pagar o dízimo de sangue'],
      [1,'Agir contra outro Assamita']
    ]
  },
  ossos: {
    name:'Trilha dos Ossos', nick:'Coveiros', virtues:['Convicção','Autocontrole','Coragem'],
    beliefs:'Evoluiu de um código moral dos Giovanni. Os seguidores acreditam que todos os seres acabam nos braços da morte e buscam compreender o propósito e a natureza da morte. Não são necessariamente cruéis — simplesmente valorizam o conhecimento mais do que a vida humana.',
    sins:[
      [10,'Demonstrar medo da morte'],
      [9,'Falhar em estudar uma ocorrência de morte'],
      [8,'Assassinato acidental'],
      [7,'Adiar uma refeição quando faminto'],
      [6,'Sucumbir ao frenesi'],
      [5,'Recusar-se a matar quando uma oportunidade surge'],
      [4,'Tomar decisão baseada na emoção, não na lógica'],
      [3,'Incomodar-se em benefício de outros'],
      [2,'Evitar uma morte desnecessariamente'],
      [1,'Evitar uma morte deliberadamente']
    ]
  },
  caim: {
    name:'Trilha de Caim', nick:'Nodistas', virtues:['Convicção','Instinto','Coragem'],
    beliefs:'Os Nodistas tentam se tornar mais parecidos com Caim, o primeiro vampiro, buscando compreender os limites e poderes da forma morta-viva. Estudam o Livro de Nod e acreditam que seguindo o exemplo de Caim é possível entender a verdadeira natureza do vampirismo.',
    sins:[
      [10,'Colocar mortais acima de vampiros em importância'],
      [9,'Falhar em avançar o conhecimento Cainita'],
      [8,'Recusar-se a usar os poderes vampíricos quando útil'],
      [7,'Suprimir a Besta sem necessidade'],
      [6,'Sucumbir ao frenesi sem tentar aprender com ele'],
      [5,'Colocar conforto pessoal acima do estudo'],
      [4,'Recusar-se a testar os próprios limites'],
      [3,'Mentir para outro Nodista'],
      [2,'Recusar-se a progredir na Diablerie quando possível'],
      [1,'Negar a natureza de Caim em si mesmo']
    ]
  },
  noite: {
    name:'Trilha da Noite', nick:'Sombras', virtues:['Convicção','Instinto','Coragem'],
    beliefs:'Os seguidores acreditam que os vampiros são criaturas da noite por direito divino e que sua missão é governar as sombras e impor a ordem oculta. A Besta não é algo a ser temido, mas sim um aspecto natural da existência vampírica a ser dominado.',
    sins:[
      [10,'Agir de dia quando há alternativa'],
      [9,'Mostrar fraqueza diante de mortais'],
      [8,'Falhar em dominar a Besta em momento crucial'],
      [7,'Permitir que um mortal descubra a natureza vampírica'],
      [6,'Sucumbir ao frenesi sem razão'],
      [5,'Recusar-se a reivindicar território legítimo'],
      [4,'Agir contra os interesses da noite vampírica'],
      [3,'Revelar segredos vampíricos voluntariamente'],
      [2,'Colaborar com caçadores de vampiros'],
      [1,'Trair outro vampiro a mortais']
    ]
  },
  paraisia: {
    name:'Trilha do Paraíso', nick:'Arcanistas', virtues:['Consciência','Instinto','Coragem'],
    beliefs:'Seguida por alguns Toreador e Lasombra, busca uma harmonia estética entre a Besta e a beleza da criação. Os seguidores acreditam que é possível transcender a maldição vampírica através da perfeição artística e espiritual.',
    sins:[
      [10,'Criar algo sem intenção estética'],
      [9,'Destruir algo de beleza genuína'],
      [8,'Alimentar-se de forma brutal e sem elegância'],
      [7,'Sucumbir ao frenesi destrutivo'],
      [6,'Negligenciar o cultivo da própria alma'],
      [5,'Rejeitar a beleza por comodidade'],
      [4,'Ferir um artista ou criativo sem motivo'],
      [3,'Destruir deliberadamente uma obra de arte'],
      [2,'Comprometer os princípios estéticos por ganho'],
      [1,'Negar completamente o valor da beleza']
    ]
  }
};

const GEN_TABLE = [
  { gen:13, pts:10, maxAttr:5, maxPool:10, note:'Novato típico' },
  { gen:12, pts:11, maxAttr:5, maxPool:10, note:'' },
  { gen:11, pts:12, maxAttr:5, maxPool:10, note:'' },
  { gen:10, pts:13, maxAttr:5, maxPool:10, note:'Ancillae' },
  { gen:9,  pts:14, maxAttr:5, maxPool:10, note:'Experiente' },
  { gen:8,  pts:15, maxAttr:5, maxPool:15, note:'Ancião' },
];

const HUMANITY_SCALE = [
  [10,'Santo',       'Mais humano que os próprios humanos; repulsa total pela violência'],
  [9, 'Compassivo',  'Profundamente moral; hesita em causar qualquer dano'],
  [8, 'Atensioso',   'Moralidade humana elevada; sente remorso pelo mínimo'],
  [7, 'Normal',      'Padrão humano; se passa facilmente por mortal'],
  [6, 'Reservado',   'Aceita que a morte acontece; levemente desagradável'],
  [5, 'Distante',    'Indiferente ao sofrimento alheio; deformações sutis'],
  [4, 'Insensível',  'Aceita matar; aspecto pálido e cadavérico'],
  [3, 'Frio',        'Entrega-se a prazeres distorcidos; dificilmente parece humano'],
  [2, 'Bestial',     'Perversão ativa; quase irreconhecível como ex-humano'],
  [1, 'Horroroso',   'Na beira da loucura bestial; apenas impulsos básicos'],
  [0, 'Monstruoso',  'Controlado pela Besta — NPC permanente do Narrador'],
];

const ATTRS_PHYSICAL = ['Força','Destreza','Vigor'];
const ATTRS_SOCIAL   = ['Carisma','Manipulação','Aparência'];
const ATTRS_MENTAL   = ['Percepção','Inteligência','Raciocínio'];
const SKILLS_TALENTS  = ['Alerteza','Atletismo','Briga','Empatia','Esquiva','Expressão','Intimidação','Lábia','Liderança','Subterfúgio'];
const SKILLS_PERICIAS = ['Animais','Armas Brancas','Armas de Fogo','Condução','Etiqueta','Furtividade','Meditação','Performance','Segurança','Sobrevivência','Tecnologia'];
const SKILLS_KNOW     = ['Acadêmicos','Burocracia','Ciência','Direito','Finanças','Investigação','Linguística','Medicina','Ocultismo','Política','Tecnologia da Informação'];

const BACKGROUNDS = ['Aliados','Contatos','Domínio','Fama','Geração','Identidade Alternativa','Influência','Lacaios','Mentor','Rebanho','Recursos','Status'];

const VIRTUES_HUMAN = [
  { id:'consciencia',  name:'Consciência',  desc:'Capacidade de reconhecer bem e mal. Base da Humanidade e testes de degeneração.' },
  { id:'autocontrole', name:'Autocontrole', desc:'Resistência ao frenesi por rejeição da Besta. Usado para evitar e orientar o frenesi.' },
  { id:'coragem',      name:'Coragem',      desc:'Resistência ao medo e pânico. Base da Força de Vontade inicial.' }
];
const VIRTUES_PATHS = [
  { id:'conviccao', name:'Convicção', desc:'Virtude alternativa à Consciência. Reconhece falhas e planeja superá-las sem remorso humano.' },
  { id:'instinto',  name:'Instinto',  desc:'Alternativa ao Autocontrole. Controla a Besta pela familiaridade, não pela rejeição.' },
  { id:'coragem',   name:'Coragem',   desc:'Universal — todos os personagens têm Coragem, independente da Trilha.' }
];

const ATTR_PRIORITY_PTS  = [7, 5, 3];
const SKILL_PRIORITY_PTS = [13, 9, 5];
const BONUS_PTS_TOTAL = 15;
const BONUS_COSTS = { attr:5, skill:2, disc:7, bg:1, virtue:2, humanity:2, willpower:1 };

/* ==================== STATE ==================== */
const state = {
  step: 1,
  name: '', player: '', concept: '', nature: '', behavior: '', history: '',
  clan: null, generation: 13,
  path: 'humanidade',
  attrPriority: [],   // ['physical','social','mental'] in priority order
  skillPriority: [],
  attrs: {},
  skills: {},
  disciplines: {},
  backgrounds: {},
  virtues: { consciencia:1, autocontrole:1, coragem:1, conviccao:0, instinto:0 },
  bonusSpent: 0,
  qualities: '',
  diceHistory: [],
};

// init defaults
[...ATTRS_PHYSICAL,...ATTRS_SOCIAL,...ATTRS_MENTAL].forEach(a => state.attrs[a] = 1);
[...SKILLS_TALENTS,...SKILLS_PERICIAS,...SKILLS_KNOW].forEach(s => state.skills[s] = 0);
Object.keys(DISCIPLINES).forEach(d => state.disciplines[d] = 0);
BACKGROUNDS.forEach(b => state.backgrounds[b] = 0);

/* ==================== HELPERS ==================== */
function el(id)  { return document.getElementById(id); }
function qs(sel) { return document.querySelector(sel); }

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, duration = 2600) {
  const t = el('toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  setTimeout(() => t.classList.remove('is-visible'), duration);
}

function dotsHtml(val, max = 5, clickFn = null, extraClass = '') {
  return `<div class="dots ${extraClass}">` +
    Array.from({length:max}, (_,i) => {
      const filled = i < val ? ' is-filled' : '';
      const click  = clickFn ? ` onclick="${clickFn}(${i+1})"` : '';
      return `<div class="dot${filled}"${click}></div>`;
    }).join('') +
  '</div>';
}

function fichaDotsHtml(val, max = 5) {
  return `<div class="ficha-dots">` +
    Array.from({length:max}, (_,i) => `<div class="ficha-dot ${i < val ? 'is-filled':''}"></div>`).join('') +
  '</div>';
}

/* ==================== NAVIGATION ==================== */
function goStep(n) {
  document.querySelectorAll('.section-panel').forEach(s => s.classList.remove('is-active'));
  document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('is-active'));
  el('step' + n).classList.add('is-active');
  el('stepBtn' + n).classList.add('is-active');
  state.step = n;
  el('progressFill').style.width = (n / 6 * 100) + '%';
  if (n === 5) renderDerived();
  if (n === 6) renderFinalSheet();
  window.scrollTo(0, 0);
  updateContext();
}

/* ==================== STEP 1: CONCEPT ==================== */
function renderClans() {
  el('clanGrid').innerHTML = Object.entries(CLANS).map(([id,c]) =>
    `<div class="clan-card ${state.clan === id ? 'is-selected':''}" id="clan-${id}" onclick="selectClan('${id}')">
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
  const c = CLANS[id];
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
    <div class="clan-weakness"><span class="clan-weakness__label">⚠ Fraqueza do Clã</span>${escHtml(c.weakness)}</div>`;
  renderDiscGrid();
  updateContext();
}

/* ==================== STEP 2: ATTRIBUTES ==================== */
function setPriority(type, group) {
  const arr = type === 'attr' ? state.attrPriority : state.skillPriority;
  const idx = arr.indexOf(group);
  if (idx >= 0) arr.splice(idx, 1);
  else if (arr.length < 3) arr.push(group);

  const pts = type === 'attr' ? ATTR_PRIORITY_PTS : SKILL_PRIORITY_PTS;
  const prefix = type === 'attr' ? 'ap' : 'sp';
  const labels = ['is-primary','is-secondary','is-tertiary'];

  ['physical','social','mental','talents','pericias','knowledge'].forEach(g => {
    const box = el(prefix + '-' + g);
    if (!box) return;
    box.classList.remove('is-primary','is-secondary','is-tertiary');
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
  if (type === 'attr') renderAllAttrs();
  if (type === 'skill') renderAllSkills();
}

function getAttrMax(group) {
  const idx = state.attrPriority.indexOf(group);
  return idx >= 0 ? 1 + ATTR_PRIORITY_PTS[idx] : 5;
}

function renderAttrGroup(containerId, attrs, infoId, group) {
  const c = el(containerId);
  if (!c) return;
  const used = attrs.reduce((s,a) => s + state.attrs[a] - 1, 0);
  const max  = state.attrPriority.indexOf(group) >= 0 ? ATTR_PRIORITY_PTS[state.attrPriority.indexOf(group)] : '?';
  if (el(infoId)) el(infoId).textContent = `gastos: ${used} / ${max}`;

  c.innerHTML = attrs.map(a => {
    const v = state.attrs[a];
    const disabled = a === 'Aparência' && state.clan === 'nosferatu';
    return `<div class="dot-row">
      <span class="dot-row__label">${a}</span>
      <div class="dots">
        ${Array.from({length:5},(_,i) => {
          const f = v > i ? ' is-filled':'';
          const d = disabled ? ' is-disabled':'';
          const fn = disabled ? '' : `onclick="setAttr('${a}',${i+1})"`;
          return `<div class="dot${f}${d}" ${fn}></div>`;
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
  const used = skills.reduce((s,k) => s + state.skills[k], 0);
  const idx  = state.skillPriority.indexOf(group);
  const max  = idx >= 0 ? SKILL_PRIORITY_PTS[idx] : '?';
  if (el(infoId)) el(infoId).textContent = `gastos: ${used} / ${max}`;

  c.innerHTML = skills.map(s => {
    const v = state.skills[s];
    return `<div class="dot-row">
      <span class="dot-row__label">${s}</span>
      <div class="dots">
        ${Array.from({length:5},(_,i) => {
          const f = v > i ? ' is-filled':'';
          return `<div class="dot${f}" onclick="setSkill('${s}',${i+1})"></div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

function renderAllSkills() {
  renderSkillGroup('skills-talents', SKILLS_TALENTS, 'tal-info', 'talents');
  renderSkillGroup('skills-pericias', SKILLS_PERICIAS,'per-info', 'pericias');
  renderSkillGroup('skills-know',     SKILLS_KNOW,    'kno-info', 'knowledge');
}

function setSkill(skill, val) {
  const cur = state.skills[skill];
  state.skills[skill] = cur === val ? Math.max(0, val - 1) : val;
  renderAllSkills();
}

/* ==================== STEP 4: ADVANTAGES ==================== */
function renderDiscGrid() {
  const c = el('discGrid');
  if (!c) return;
  const clan = state.clan ? CLANS[state.clan] : null;
  const clanDiscs = clan ? clan.disc : [];
  const allDiscs = [...new Set([...clanDiscs, ...Object.keys(DISCIPLINES)])];
  c.innerHTML = allDiscs.map(d => {
    const isClan = clanDiscs.includes(d);
    const v = state.disciplines[d] || 0;
    return `<div class="disc-card ${isClan ? 'is-clan':''}">
      <div class="disc-card__header">
        <span class="disc-card__name">${d}</span>
        ${isClan ? '<span class="disc-card__badge">Clã</span>' : ''}
      </div>
      <div class="disc-card__desc">${DISCIPLINES[d]}</div>
      <div class="dots" style="margin-top:0.45rem">
        ${Array.from({length:3},(_,i) => {
          const f = v > i ? ' is-filled':'';
          return `<div class="dot${f}" onclick="setDisc('${d}',${i+1})"></div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

function setDisc(d, val) {
  state.disciplines[d] = state.disciplines[d] === val ? Math.max(0,val-1) : val;
  renderDiscGrid();
}

function renderBackgrounds() {
  const c = el('bgList');
  if (!c) return;
  const total = Object.values(state.backgrounds).reduce((a,b) => a+b, 0);
  const rem = 5 - total;
  const cnt = el('bgPtsCount');
  if (cnt) {
    cnt.textContent = rem;
    cnt.className = 'points-bar__count' + (rem < 0 ? ' is-over' : rem === 0 ? ' is-done' : '');
  }
  c.innerHTML = BACKGROUNDS.map(bg => {
    const v = state.backgrounds[bg];
    return `<div class="bg-row">
      <span class="bg-row__name">${bg}</span>
      <div class="dots">
        ${Array.from({length:5},(_,i) => {
          const f = v > i ? ' is-filled':'';
          return `<div class="dot${f}" onclick="setBg('${bg}',${i+1})"></div>`;
        }).join('')}
      </div>
      <span class="bg-row__val">${v}</span>
    </div>`;
  }).join('');
}

function setBg(bg, val) {
  state.backgrounds[bg] = state.backgrounds[bg] === val ? Math.max(0,val-1) : val;
  renderBackgrounds();
}

function renderVirtues() {
  const c = el('virtueList');
  if (!c) return;
  const path = PATHS[state.path];
  const useAlt = path && !path.isHumanity;
  const virtList = useAlt ? VIRTUES_PATHS : VIRTUES_HUMAN;
  const total = virtList.reduce((s,v) => s + (state.virtues[v.id] || 0), 0);

  c.innerHTML = virtList.map(v => {
    const val = state.virtues[v.id] || 0;
    return `<div class="virtue-card">
      <div class="virtue-card__top">
        <div class="virtue-card__info">
          <div class="virtue-card__name">${v.name}</div>
          <div class="virtue-card__desc">${v.desc}</div>
        </div>
        <div class="dots">
          ${Array.from({length:5},(_,i) => {
            const f = val > i ? ' is-filled':'';
            const min = 1;
            return `<div class="dot${f}" onclick="setVirtue('${v.id}',${i+1})"></div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

function setVirtue(id, val) {
  const cur = state.virtues[id] || 0;
  state.virtues[id] = cur === val ? Math.max(1, val-1) : val;
  renderVirtues();
  renderDerived();
}

/* ==================== STEP 4b: PATHS ==================== */
function renderPathSelector() {
  const c = el('pathSelector');
  if (!c) return;
  c.innerHTML = Object.entries(PATHS).map(([id,p]) =>
    `<div class="path-card ${state.path === id ? 'is-selected':''}" id="path-${id}" onclick="selectPath('${id}')">
      <div class="path-card__name">${p.name}</div>
      <div class="path-card__nick">${p.nick !== '—' ? p.nick : 'Padrão'}</div>
      <div class="path-card__virtues">
        <strong>Virtudes</strong>
        ${p.virtues.join(' · ')}
      </div>
    </div>`
  ).join('');
}

function selectPath(id) {
  state.path = id;
  document.querySelectorAll('.path-card').forEach(c => c.classList.remove('is-selected'));
  el('path-' + id).classList.add('is-selected');
  const p = PATHS[id];
  const det = el('pathDetail');
  if (det) {
    det.className = 'path-detail is-visible';
    det.innerHTML = `
      <div class="path-detail__title">${p.name} — ${p.nick}</div>
      <div class="path-detail__beliefs">${escHtml(p.beliefs)}</div>
      <table class="path-sin-table">
        <thead><tr><th>Nível</th><th>Hierarquia de Pecados</th></tr></thead>
        <tbody>${p.sins.map(([n,s]) => `<tr><td>${n}</td><td>${escHtml(s)}</td></tr>`).join('')}</tbody>
      </table>`;
  }
  renderVirtues();
  renderDerived();
}

/* ==================== STEP 5: FINISHING ==================== */
function getDerived() {
  const path = PATHS[state.path];
  let humBase;
  if (path && !path.isHumanity) {
    humBase = (state.virtues.conviccao||0) + (state.virtues.autocontrole||0);
  } else {
    humBase = (state.virtues.consciencia||0) + (state.virtues.autocontrole||0);
  }
  const humanity  = Math.min(10, humBase);
  const willpower = state.virtues.coragem || 1;
  const genRow = GEN_TABLE.find(r => r.gen === parseInt(state.generation)) || GEN_TABLE[0];
  return { humanity, willpower, bloodPts: genRow.pts, maxAttr: genRow.maxAttr };
}

function renderDerived() {
  const c = el('derivedStats');
  if (!c) return;
  const d = getDerived();
  const hScale = HUMANITY_SCALE.find(([n]) => n === d.humanity);
  const hLabel = hScale ? hScale[1] : '';
  c.innerHTML = `
    <div class="derived-stat derived-stat--humanity">
      <span class="derived-stat__value">${d.humanity}</span>
      <span class="derived-stat__label">Humanidade<br><small style="font-size:0.62rem;font-style:italic;">${hLabel}</small></span>
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
  c.innerHTML = HUMANITY_SCALE.map(([n,name,eff]) =>
    `<div class="humanity-level ${d.humanity === n ? 'is-current':''}">
      <span class="humanity-level__num">${n}</span>
      <span class="humanity-level__name">${name}</span>
      <span class="humanity-level__effects">${eff}</span>
    </div>`
  ).join('');
}

function renderGenTable() {
  const c = el('genTable');
  if (!c) return;
  const selGen = parseInt(state.generation);
  c.innerHTML = `<table class="gen-table">
    <thead><tr><th>Geração</th><th>Pts. Sangue</th><th>Atrib. Max</th><th>Nota</th></tr></thead>
    <tbody>${GEN_TABLE.map(r =>
      `<tr style="${r.gen===selGen?'background:rgba(201,168,76,0.08)':''}">
        <td>${r.gen}ª</td><td>${r.pts}</td><td>${r.maxAttr}</td><td style="color:var(--muted);font-style:italic">${r.note}</td>
      </tr>`
    ).join('')}</tbody>
  </table>`;
}

/* ==================== DICE ROLLER ==================== */
function rollDice() {
  const pool = parseInt(el('dicePool')?.value || 3);
  const diff = parseInt(el('diceDiff')?.value || 6);
  if (pool < 1 || pool > 20) { showToast('Pool entre 1 e 20'); return; }

  const rolls = Array.from({length:pool}, () => Math.ceil(Math.random() * 10));
  const successes = rolls.filter(r => r >= diff).length;
  const ones = rolls.filter(r => r === 1).length;
  const botch = successes === 0 && ones > 0;

  const c = el('diceResult');
  if (!c) return;

  let verdict, verdictColor;
  if (botch)           { verdict = '💀 FALHA CRÍTICA'; verdictColor = 'var(--blood-light)'; }
  else if (!successes) { verdict = '✗ Falha';          verdictColor = 'var(--muted)'; }
  else if (successes === 1) { verdict = '✓ Sucesso mínimo'; verdictColor = 'var(--green-ok)'; }
  else if (successes <= 2)  { verdict = '✓✓ Sucesso moderado'; verdictColor = 'var(--green-ok)'; }
  else                      { verdict = '✓✓✓ Sucesso total!'; verdictColor = '#8ede8e'; }

  c.innerHTML = `
    <div class="dice-row" style="margin-bottom:0.75rem">
      ${rolls.map(r => {
        let cls = r === 1 ? 'is-botch' : r >= diff ? 'is-success' : 'is-fail';
        return `<div class="die ${cls}">${r}</div>`;
      }).join('')}
    </div>
    <div style="font-family:var(--font-display);font-size:1rem;color:${verdictColor}">${verdict}</div>
    <div style="font-size:0.8rem;color:var(--muted);margin-top:0.3rem">${successes} sucesso(s) · ${ones} um(s) · dificuldade ${diff}</div>`;

  state.diceHistory.unshift({ pool, diff, rolls, successes, botch, time: new Date().toLocaleTimeString('pt-BR') });
}

/* ==================== STEP 6: FINAL SHEET ==================== */
function renderFinalSheet() {
  const c = el('fichaFinal');
  if (!c) return;
  const d   = getDerived();
  const clan = state.clan ? CLANS[state.clan] : null;
  const path = PATHS[state.path];

  const attrSection = (title, attrs) => `
    <div class="ficha-section">
      <div class="ficha-section__title">${title}</div>
      ${attrs.map(a => `<div class="ficha-row">
        <span class="ficha-row__label">${a}</span>
        ${fichaDotsHtml(state.attrs[a])}
      </div>`).join('')}
    </div>`;

  const skillSection = (title, skills) => {
    const active = skills.filter(s => state.skills[s] > 0);
    if (!active.length) return `<div class="ficha-section"><div class="ficha-section__title">${title}</div><div style="font-size:0.8rem;color:var(--ink-light);font-style:italic">Nenhuma</div></div>`;
    return `<div class="ficha-section">
      <div class="ficha-section__title">${title}</div>
      ${active.map(s => `<div class="ficha-row">
        <span class="ficha-row__label">${s}</span>
        ${fichaDotsHtml(state.skills[s])}
      </div>`).join('')}
    </div>`;
  };

  const virtues = path.isHumanity ? VIRTUES_HUMAN : VIRTUES_PATHS;
  const activeBgs = BACKGROUNDS.filter(b => state.backgrounds[b] > 0);
  const activeDiscs = Object.entries(state.disciplines).filter(([,v]) => v > 0);

  c.innerHTML = `<div class="ficha-sheet">
    <div class="ficha-header">
      <div class="ficha-header__title">🩸 Vampiro: A Máscara</div>
      <div class="ficha-header__sub">Edição de 20º Aniversário — Ficha de Personagem</div>
    </div>

    <div class="ficha-3col" style="margin-bottom:1.4rem">
      <div class="ficha-section">
        <div class="ficha-section__title">Identidade</div>
        <div class="ficha-row"><span class="ficha-row__label">Nome</span><strong>${escHtml(state.name||'—')}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Jogador</span><strong>${escHtml(state.player||'—')}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Clã</span><strong>${clan ? clan.name : '—'}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Geração</span><strong>${state.generation}ª</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Conceito</span><strong style="font-size:0.82rem">${escHtml(state.concept||'—')}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Natureza</span><strong style="font-size:0.82rem">${escHtml((state.nature||'—').split(' — ')[0])}</strong></div>
        <div class="ficha-row"><span class="ficha-row__label">Comportamento</span><strong>${escHtml(state.behavior||'—')}</strong></div>
      </div>
      <div class="ficha-section">
        <div class="ficha-section__title">Valores Derivados</div>
        <div class="ficha-row"><span class="ficha-row__label">${path.name}</span>${fichaDotsHtml(d.humanity)}</div>
        <div class="ficha-row"><span class="ficha-row__label">Força de Vontade</span>${fichaDotsHtml(d.willpower)}</div>
        <div class="ficha-row"><span class="ficha-row__label">Pontos de Sangue</span><strong>${d.bloodPts}</strong></div>
        ${clan ? `<div class="ficha-section__title" style="margin-top:0.9rem">Disciplinas do Clã</div>
          ${clan.disc.map(dc => `<div class="ficha-row"><span class="ficha-row__label">${dc}</span>${fichaDotsHtml(state.disciplines[dc]||0)}</div>`).join('')}` : ''}
      </div>
      <div class="ficha-section">
        <div class="ficha-section__title">Virtudes</div>
        ${virtues.map(v => `<div class="ficha-row"><span class="ficha-row__label">${v.name}</span>${fichaDotsHtml(state.virtues[v.id]||0)}</div>`).join('')}
        ${activeBgs.length ? `<div class="ficha-section__title" style="margin-top:0.9rem">Antecedentes</div>
          ${activeBgs.map(b => `<div class="ficha-row"><span class="ficha-row__label">${b}</span>${fichaDotsHtml(state.backgrounds[b])}</div>`).join('')}` : ''}
      </div>
    </div>

    <div class="ficha-3col" style="margin-bottom:1.4rem">
      ${attrSection('Atributos Físicos', ATTRS_PHYSICAL)}
      ${attrSection('Atributos Sociais', ATTRS_SOCIAL)}
      ${attrSection('Atributos Mentais', ATTRS_MENTAL)}
    </div>

    <div class="ficha-3col" style="margin-bottom:1.4rem">
      ${skillSection('Talentos', SKILLS_TALENTS)}
      ${skillSection('Perícias', SKILLS_PERICIAS)}
      ${skillSection('Conhecimentos', SKILLS_KNOW)}
    </div>

    ${activeDiscs.length ? `
    <div class="ficha-section">
      <div class="ficha-section__title">Todas as Disciplinas</div>
      <div class="ficha-3col">
        ${activeDiscs.map(([d,v]) => `<div class="ficha-row"><span class="ficha-row__label">${d}</span>${fichaDotsHtml(v)}</div>`).join('')}
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

/* ==================== SAVE / LOAD ==================== */
function saveChar() {
  syncFormState();
  const data = { version:1, state: JSON.parse(JSON.stringify(state)) };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = (state.name || 'personagem').replace(/\s+/g,'_') + '_vampiro.json';
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
      if (!data.state) throw new Error();
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

function syncFormState() {
  state.name      = el('charName')?.value || '';
  state.player    = el('playerName')?.value || '';
  state.concept   = el('charConcept')?.value || '';
  state.nature    = el('charNature')?.value || '';
  state.behavior  = el('charBehavior')?.value || '';
  state.generation= parseInt(el('charGen')?.value || '13');
  state.history   = el('charHistory')?.value || '';
  state.qualities = el('charQualities')?.value || '';
}

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

/* ==================== CONTEXT FOR AI ==================== */
function updateContext() {
  syncFormState();
  const clan = state.clan ? CLANS[state.clan] : null;
  const d    = getDerived();
  window.__charContext = {
    name: state.name, clan: clan?.name, path: PATHS[state.path]?.name,
    humanity: d.humanity, willpower: d.willpower, bloodPts: d.bloodPts,
    attrs: state.attrs, skills: state.skills,
    disciplines: Object.fromEntries(Object.entries(state.disciplines).filter(([,v])=>v>0)),
    backgrounds: Object.fromEntries(Object.entries(state.backgrounds).filter(([,v])=>v>0)),
    virtues: state.virtues
  };
}

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  updateContext();
});
