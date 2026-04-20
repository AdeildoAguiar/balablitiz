# 🩸 Vampiro: A Máscara v20 — Criador de Ficha

Criador de ficha de personagem interativo para **Vampiro: A Máscara — Edição de 20º Aniversário** (White Wolf / Onyx Path Publishing), com assistente de IA integrado.

## ✨ Funcionalidades

- **6 passos guiados** de criação de personagem
- Seleção de **13 Clãs** com fraquezas e disciplinas nativas
- Sistema de **pontos por prioridade** para atributos e habilidades
- **6 Trilhas da Sabedoria** com hierarquias de pecados
- Cálculo automático de Humanidade, Força de Vontade e Pontos de Sangue
- **Rolador de dados d10** integrado
- **Ficha final** renderizada, pronta para imprimir
- **Salvar / Carregar** ficha em JSON
- **Assistente de IA** lateral especialista em regras do sistema

## 📁 Estrutura do Projeto

```
vampiro-v20/
├── index.html        # Estrutura HTML + navegação entre passos
├── css/
│   └── styles.css    # Design system completo (tokens, componentes, responsivo)
└── js/
    ├── data.js       # Dados do jogo (Clãs, Disciplinas, Trilhas, tabelas)
    ├── state.js      # Estado global, helpers, save/load
    ├── app.js        # Lógica de renderização e interação
    └── ai.js         # Módulo do assistente de IA (Claude API)
```

## 🚀 Como usar

### Localmente
Basta abrir `index.html` no navegador — não requer servidor ou dependências.

> **Nota:** O assistente de IA faz chamadas diretas à API da Anthropic. Para usá-lo, você precisa de uma chave de API válida. Em produção, recomendamos um backend intermediário (ver `api/main.py`) para não expor a chave.

### GitHub Pages
1. Faça o fork/upload deste repositório
2. Ative o GitHub Pages apontando para a branch `main` / pasta raiz
3. Acesse via `https://seu-usuario.github.io/vampiro-v20`

## 🤖 Assistente de IA

O assistente usa o modelo **Claude** da Anthropic e responde dúvidas sobre:
- Regras do sistema d10
- Clãs, Disciplinas e fraquezas
- Trilhas da Sabedoria e virtudes
- Frenesi, torpor e Humanidade
- Análise da ficha atual do jogador

Para configurar a chave da API, edite `js/ai.js` ou use o backend Python em `api/main.py`.

## 🐍 Backend Python (opcional)

Para não expor sua chave de API no frontend, use o backend FastAPI:

```bash
pip install fastapi uvicorn anthropic python-dotenv
cp .env.example .env  # adicione sua ANTHROPIC_API_KEY
uvicorn api.main:app --reload --port 8000
```

## 📖 Sobre o sistema

Vampiro: A Máscara é um RPG de mesa publicado pela White Wolf / Onyx Path Publishing.  
Este projeto é uma ferramenta de fã, sem fins lucrativos, para auxiliar na criação de personagens.

## 📄 Licença

Projeto open source para uso pessoal e educacional.  
Vampiro: A Máscara © White Wolf / Onyx Path Publishing. Todos os direitos reservados.
