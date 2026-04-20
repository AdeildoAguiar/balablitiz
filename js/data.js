/* =============================================
   VAMPIRO: A MÁSCARA — GAME DATA
   js/data.js
   ============================================= */

'use strict';

const CLANS = {
  assamita:   { name:'Assamita',    nick:'Assassinos',         icon:'🗡️', seita:'Independente',         disc:['Rapidez','Ofuscação','Quietus'],       attrFocus:'Físico',          weakness:'Maldição Tremere: beber sangue de Membro causa dano letal automático por ponto drenado. Diablerie inflige dano agravado.',                                                    bestFor:'Assassinos, personagens furtivos e de ação' },
  brujah:     { name:'Brujah',      nick:'Ralé',                icon:'✊', seita:'Camarilla',             disc:['Rapidez','Potência','Presença'],        attrFocus:'Físico',          weakness:'Dificuldades de frenesi +2 acima do normal. Nunca pode gastar FdV para EVITAR o frenesi.',                                                                                   bestFor:'Guerreiros, rebeldes, personagens passionais' },
  gangrel:    { name:'Gangrel',     nick:'Forasteiros',         icon:'🐺', seita:'Camarilla (relutante)', disc:['Animalismo','Fortitude','Metamorfose'],  attrFocus:'Físico',          weakness:'A cada frenesi adquire uma característica animal permanente (física ou comportamental).',                                                                                   bestFor:'Sobreviventes, nômades, personagens ligados à natureza' },
  giovanni:   { name:'Giovanni',    nick:'Necromantes',         icon:'💀', seita:'Independente',         disc:['Dominação','Necromancia','Potência'],    attrFocus:'Social ou Mental', weakness:'O Beijo causa o dobro de dano letal em mortais; vítimas podem morrer de dor antes de serem drenadas.',                                                                     bestFor:'Necromantes, manipuladores, personagens de intriga familiar' },
  lasombra:   { name:'Lasombra',    nick:'Guardiões',           icon:'🌑', seita:'Sabá',                  disc:['Dominação','Tenebrosidade','Potência'],  attrFocus:'Mental ou Social', weakness:'Não possuem reflexo em espelhos, água, vidro ou qualquer superfície polida. Não aparecem em fotos ou câmeras.',                                                             bestFor:'Líderes sombrios, fanatismo religioso, manipuladores' },
  malkaviano: { name:'Malkaviano',  nick:'Lunáticos',           icon:'🌀', seita:'Camarilla',             disc:['Auspícios','Demência','Ofuscação'],      attrFocus:'Mental',          weakness:'Distúrbio mental permanente e incurável. Pode gastar FdV para suprimir por uma cena, nunca cura.',                                                                          bestFor:'Jogadores experientes em roleplay; personagens únicos e visionários' },
  nosferatu:  { name:'Nosferatu',   nick:'Ratos de Esgoto',     icon:'🦇', seita:'Camarilla',             disc:['Animalismo','Ofuscação','Potência'],     attrFocus:'Físico e Mental',  weakness:'Aparência permanentemente 0, nunca pode ser melhorada. Movem-se socialmente apenas com Ofuscação.',                                                                       bestFor:'Espiões, coletores de segredos, personagens das sombras' },
  ravnos:     { name:'Ravnos',      nick:'Enganadores',         icon:'🎭', seita:'Independente',         disc:['Animalismo','Fortitude','Quimerismo'],   attrFocus:'Físico e Social',  weakness:'Escravo de um vício específico. Ao ser tentado deve ceder a menos que passe em teste de Autocontrole dif. 6.',                                                             bestFor:'Trapaceiros, nômades, personagens caóticos e imprevisíveis' },
  setitas:    { name:'Seg. de Set', nick:'Setitas / Serpentes', icon:'🐍', seita:'Independente',         disc:['Ofuscação','Presença','Serpentis'],       attrFocus:'Mental e Social',  weakness:'Luz intensa: +2 níveis de dano de saúde por exposição (soma-se ao dano solar normal).',                                                                                  bestFor:'Cultistas, sedutores, guardiões de segredos sombrios' },
  toreador:   { name:'Toreador',    nick:'Degenerados',         icon:'🌹', seita:'Camarilla',             disc:['Auspícios','Rapidez','Presença'],        attrFocus:'Social',          weakness:'Ao ver algo extraordinariamente belo, teste de Autocontrole dif. 6 ou fica paralisado pelo resto da cena.',                                                                 bestFor:'Artistas, socialites, personagens políticos de alta sociedade' },
  tremere:    { name:'Tremere',     nick:'Feiticeiros',         icon:'🔮', seita:'Camarilla',             disc:['Auspícios','Dominação','Taumaturgia'],   attrFocus:'Mental',          weakness:'Laço de sangue se forma com apenas 2 doses (em vez de 3). Todos os novatos bebem do sangue dos anciões.',                                                                  bestFor:'Feiticeiros de sangue, estrategistas arcanos, personagens de hierarquia rígida' },
  tzimisce:   { name:'Tzimisce',    nick:'Demônios',            icon:'🩸', seita:'Sabá',                  disc:['Animalismo','Auspícios','Vicissitude'],  attrFocus:'Físico ou Mental', weakness:'Deve descansar com dois punhados de terra natal. Cada noite sem isso reduz todos os pools pela metade, cumulativamente.',                                                   bestFor:'Horror corporal, vilões, personagens completamente alienígenas à humanidade' },
  ventrue:    { name:'Ventrue',     nick:'Sangue Azul',         icon:'👑', seita:'Camarilla',             disc:['Dominação','Fortitude','Presença'],      attrFocus:'Social e Mental',  weakness:'Alimenta-se apenas de um tipo específico de sangue mortal (decidido na criação). Outros tipos são regurgitados.',                                                         bestFor:'Líderes, aristocratas, personagens políticos e corporativos' }
};

const DISCIPLINES = {
  'Animalismo':    'Controle de animais e da Besta interior',
  'Auspícios':     'Percepção extra-sensorial e premonições',
  'Demência':      'Inflige loucura em outras mentes',
  'Dominação':     'Controle mental absoluto pelo olhar',
  'Fortitude':     'Resistência sobrenatural, inclusive ao sol',
  'Metamorfose':   'Transformação: garras, névoa, animais',
  'Necromancia':   'Invocar e controlar os mortos',
  'Ofuscação':     'Invisibilidade sobrenatural',
  'Potência':      'Força física sobrenatural',
  'Presença':      'Fascinar e controlar multidões',
  'Quietus':       'Arte do assassinato vampírico',
  'Quimerismo':    'Ilusões e alucinações convincentes',
  'Rapidez':       'Velocidade e reflexos sobrenaturais',
  'Serpentis':     'Poderes reptilianos e fascínio setita',
  'Taumaturgia':   'Feitiçaria do sangue — poder arcano',
  'Tenebrosidade': 'Controle sobrenatural das sombras',
  'Vicissitude':   'Moldar carne e osso à vontade'
};

const PATHS = {
  humanidade: {
    name: 'Humanidade', nick: '—', virtues: ['Consciência','Autocontrole','Coragem'], isHumanity: true,
    beliefs: 'O caminho padrão de todos os vampiros recém-Abraçados. Quanto mais alta, mais o vampiro mantém sua natureza mortal e consegue se passar por humano. Vampiros com Humanidade alta sentem remorso, hesitam antes de matar e resistem melhor à Besta.',
    sins: [
      [10,'Pensamentos egoístas'],
      [9, 'Pequenos atos de egoísmo'],
      [8, 'Ferir outrem (acidental ou não)'],
      [7, 'Furto e roubo'],
      [6, 'Violação acidental (beber fonte até secá-la por fome)'],
      [5, 'Dano intencional à propriedade'],
      [4, 'Violação por descontrole (matar fonte em frenesi)'],
      [3, 'Violação premeditada (assassinato simples)'],
      [2, 'Violação negligente (matar sem pensar)'],
      [1, 'Os atos mais hediondos e perversos']
    ]
  },
  sangue: {
    name: 'Trilha do Sangue', nick: 'Dervixe', virtues: ['Convicção','Autocontrole','Coragem'],
    beliefs: 'Praticada quase que exclusivamente pelos Assamitas. Os filhos de Haqim buscam diablerizar outros vampiros e converter os demais ao caminho de Haqim.',
    sins: [
      [10,'Matar um mortal para sustento'],
      [9, 'Quebrar uma palavra dada a um companheiro de Clã'],
      [8, 'Recusar-se a oferecer conversão a um não-Assamita'],
      [7, 'Falhar em destruir um Membro impenitente de fora do Clã'],
      [6, 'Sucumbir ao frenesi'],
      [5, 'Falhar na busca pela sabedoria de Khayyin'],
      [4, 'Falhar em exigir sangue como pagamento'],
      [3, 'Recusar ajuda a um membro mais experiente da Trilha'],
      [2, 'Falhar em pagar o dízimo de sangue'],
      [1, 'Agir contra outro Assamita']
    ]
  },
  ossos: {
    name: 'Trilha dos Ossos', nick: 'Coveiros', virtues: ['Convicção','Autocontrole','Coragem'],
    beliefs: 'Os seguidores acreditam que todos os seres acabam nos braços da morte e buscam compreender o propósito e a natureza da morte.',
    sins: [
      [10,'Demonstrar medo da morte'],
      [9, 'Falhar em estudar uma ocorrência de morte'],
      [8, 'Assassinato acidental'],
      [7, 'Adiar uma refeição quando faminto'],
      [6, 'Sucumbir ao frenesi'],
      [5, 'Recusar-se a matar quando uma oportunidade surge'],
      [4, 'Tomar decisão baseada na emoção, não na lógica'],
      [3, 'Incomodar-se em benefício de outros'],
      [2, 'Evitar uma morte desnecessariamente'],
      [1, 'Evitar uma morte deliberadamente']
    ]
  },
  caim: {
    name: 'Trilha de Caim', nick: 'Nodistas', virtues: ['Convicção','Instinto','Coragem'],
    beliefs: 'Os Nodistas tentam se tornar mais parecidos com Caim, o primeiro vampiro, estudando o Livro de Nod para entender a verdadeira natureza do vampirismo.',
    sins: [
      [10,'Colocar mortais acima de vampiros em importância'],
      [9, 'Falhar em avançar o conhecimento Cainita'],
      [8, 'Recusar-se a usar os poderes vampíricos quando útil'],
      [7, 'Suprimir a Besta sem necessidade'],
      [6, 'Sucumbir ao frenesi sem tentar aprender com ele'],
      [5, 'Colocar conforto pessoal acima do estudo'],
      [4, 'Recusar-se a testar os próprios limites'],
      [3, 'Mentir para outro Nodista'],
      [2, 'Recusar-se a progredir na Diablerie quando possível'],
      [1, 'Negar a natureza de Caim em si mesmo']
    ]
  },
  noite: {
    name: 'Trilha da Noite', nick: 'Sombras', virtues: ['Convicção','Instinto','Coragem'],
    beliefs: 'Os seguidores acreditam que os vampiros são criaturas da noite por direito divino. A Besta não é algo a ser temido, mas um aspecto natural a ser dominado.',
    sins: [
      [10,'Agir de dia quando há alternativa'],
      [9, 'Mostrar fraqueza diante de mortais'],
      [8, 'Falhar em dominar a Besta em momento crucial'],
      [7, 'Permitir que um mortal descubra a natureza vampírica'],
      [6, 'Sucumbir ao frenesi sem razão'],
      [5, 'Recusar-se a reivindicar território legítimo'],
      [4, 'Agir contra os interesses da noite vampírica'],
      [3, 'Revelar segredos vampíricos voluntariamente'],
      [2, 'Colaborar com caçadores de vampiros'],
      [1, 'Trair outro vampiro a mortais']
    ]
  },
  paraisia: {
    name: 'Trilha do Paraíso', nick: 'Arcanistas', virtues: ['Consciência','Instinto','Coragem'],
    beliefs: 'Seguida por alguns Toreador e Lasombra, busca uma harmonia estética entre a Besta e a beleza da criação através da perfeição artística e espiritual.',
    sins: [
      [10,'Criar algo sem intenção estética'],
      [9, 'Destruir algo de beleza genuína'],
      [8, 'Alimentar-se de forma brutal e sem elegância'],
      [7, 'Sucumbir ao frenesi destrutivo'],
      [6, 'Negligenciar o cultivo da própria alma'],
      [5, 'Rejeitar a beleza por comodidade'],
      [4, 'Ferir um artista ou criativo sem motivo'],
      [3, 'Destruir deliberadamente uma obra de arte'],
      [2, 'Comprometer os princípios estéticos por ganho'],
      [1, 'Negar completamente o valor da beleza']
    ]
  }
};

const GEN_TABLE = [
  { gen:13, pts:10, maxAttr:5, note:'Novato típico' },
  { gen:12, pts:11, maxAttr:5, note:'' },
  { gen:11, pts:12, maxAttr:5, note:'' },
  { gen:10, pts:13, maxAttr:5, note:'Ancillae' },
  { gen:9,  pts:14, maxAttr:5, note:'Experiente' },
];

const HUMANITY_SCALE = [
  [10,'Santo',       'Mais humano que os próprios humanos; repulsa total pela violência'],
  [9,  'Compassivo', 'Profundamente moral; hesita em causar qualquer dano'],
  [8,  'Atensioso',  'Moralidade humana elevada; sente remorso pelo mínimo'],
  [7,  'Normal',     'Padrão humano; se passa facilmente por mortal'],
  [6,  'Reservado',  'Aceita que a morte acontece; levemente desagradável'],
  [5,  'Distante',   'Indiferente ao sofrimento alheio; deformações sutis'],
  [4,  'Insensível', 'Aceita matar; aspecto pálido e cadavérico'],
  [3,  'Frio',       'Entrega-se a prazeres distorcidos; dificilmente parece humano'],
  [2,  'Bestial',    'Perversão ativa; quase irreconhecível como ex-humano'],
  [1,  'Horroroso',  'Na beira da loucura bestial; apenas impulsos básicos'],
  [0,  'Monstruoso', 'Controlado pela Besta — NPC permanente do Narrador'],
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
