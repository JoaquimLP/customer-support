# Chat de Suporte — Patch de Demo Bot

Este pacote contém correções para o chat não exibir mensagens enviadas e adiciona um **bot de demonstração** com respostas pré-definidas.

## O que foi alterado
- `src/App.tsx`: cria/recupera sessão ativa por e-mail.
- `src/components/EmailLogin.tsx`: formulário completo e validação.
- `src/components/ChatInterface.tsx`: 
  - Carrega histórico do Supabase.
  - Assina `realtime` para novas mensagens (INSERT) do `chat_messages` filtradas por `session_id`.
  - Envia mensagem do usuário **e** simula uma resposta do bot inserindo no banco (`is_support: true`).

## Pré-requisitos
Crie um projeto no Supabase e configure as variáveis no `.env`:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Aplique a migration de `supabase/migrations` (tabelas `chat_sessions` e `chat_messages` com RLS).

## Rodando
```
npm i
npm run dev
```
Abra o app, informe um e-mail e envie "oi" para ver a resposta do bot.