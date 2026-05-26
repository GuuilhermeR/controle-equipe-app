# EquipePro - Controle de Equipes `[MVP]`

Aplicação web front-end para gerenciamento de equipes em estágio de **MVP (Produto Mínimo Viável)**.

## Funcionalidades

- **Dashboard** — métricas, gráficos de membros por time e tarefas por status, atividades recentes
- **Membros** — cadastro, edição e remoção com cards, busca e filtro por time
- **Times** — cadastro, edição e remoção com cores personalizadas e agrupamento de membros
- **Tarefas (Kanban)** — quadro com drag-and-drop entre colunas A Fazer / Fazendo / Concluído
- **Escala de Turnos** — calendário mensal interativo com adição/remoção de turnos (Manhã/Tarde/Noite)
- **Relatórios** — produtividade por membro com barra percentual e exportação CSV
- **Tema claro/escuro** — alternância com persistência em `localStorage`

## Tech Stack

React 19, TypeScript 6, Vite 8, Ant Design 6, Zustand, Tailwind CSS 4, @dnd-kit, Recharts, date-fns

## Como executar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── main.tsx            # Entry point
├── App.tsx             # Rotas
├── pages/              # Dashboard, Membros, Times, Tarefas, Escala, Relatorios
├── store/              # Zustand stores com persistência em localStorage
├── components/layout/  # Sidebar, Header
└── lib/                # Types e utilitários
```

## Status

MVP funcional com dados mockados e persistência local. Dados são salvos apenas no navegador — não há backend ou autenticação real.

## Próximos passos sugeridos

- Backend com API REST e banco de dados
- Autenticação e autorização
- Testes automatizados
- Refatoração em componentes menores
- Hooks customizados e camada de serviços
