# 🩸 Vampiro: A Máscara v20 — Criador de Ficha

Sistema completo de criação de fichas com IA integrada.

## 📁 Estrutura do Projeto

```
vampiro/
├── index.html          ← Página principal (abra no navegador)
├── css/
│   └── styles.css      ← Todo o CSS separado por componentes
├── js/
│   ├── app.js          ← Lógica do app, dados do jogo, renderização
│   └── ai.js           ← Módulo de chat com IA (Claude API)
└── api/
    ├── main.py         ← Backend Python (FastAPI) — opcional
    └── requirements.txt
```

## 🚀 Deploy no Vercel (recomendado — só o front-end)

O sistema funciona 100% no navegador sem backend:

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Instale o Vercel CLI: `npm i -g vercel`
3. Na pasta do projeto: `vercel`
4. Pronto! O site vai ao ar automaticamente.

**Ou arraste a pasta para o Vercel via interface web.**

## 🐍 Backend Python (opcional — recursos extras)

O backend Python adiciona:
- Endpoint `/analyze` — análise completa da ficha
- Endpoint `/preludio` — geração de história de Abraço
- Endpoint `/dice` — rolagem de dados server-side
- Controle centralizado da API Key (mais seguro)

### Instalação

```bash
cd api
pip install -r requirements.txt
```

### Configuração

Crie um arquivo `.env` na pasta `api/`:
```
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
```

### Execução

```bash
uvicorn api.main:app --reload --port 8000
```

Acesse a documentação em: `http://localhost:8000/docs`

### Deploy do Backend no Vercel

Crie um `vercel.json` na raiz:
```json
{
  "functions": {
    "api/main.py": { "runtime": "python3.11" }
  },
  "routes": [
    { "src": "/api/(.*)", "dest": "api/main.py" },
    { "src": "/(.*)", "dest": "index.html" }
  ]
}
```

## 🎮 Como Usar

1. Abra `index.html` no navegador (ou acesse a URL do Vercel)
2. Siga os 6 passos de criação de personagem
3. Use o chat lateral para tirar dúvidas sobre as regras
4. Clique em "Analisar minha ficha" para receber sugestões da IA
5. Na Ficha Final, salve em JSON ou imprima

## ✨ Funcionalidades

- ✅ 13 Clãs completos com Disciplinas e fraquezas
- ✅ Trilhas da Sabedoria (Humanidade, Sangue, Ossos, Caim, Noite, Paraíso)
- ✅ Valores derivados automáticos (Humanidade, FdV, Pts. Sangue)
- ✅ Escala de Humanidade com efeitos por nível
- ✅ Tabela de Geração com limites
- ✅ Rolador de dados d10 integrado
- ✅ IA que lê a ficha e responde em contexto
- ✅ Salvar/carregar ficha em JSON
- ✅ Impressão formatada
- ✅ CSS totalmente separado com design system completo
- ✅ Backend Python com FastAPI (análise avançada)
