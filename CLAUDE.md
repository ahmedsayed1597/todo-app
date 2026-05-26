# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build
npm run lint       # ESLint + Prettier check
```

There are no tests configured in this project.

## Architecture

This is an Angular 16 standalone-components TodoMVC app with no NgModules.

**State management — signal-based store (`todos.signal.ts`):**  
State lives in a factory function (`todosFactory`) that returns a plain object of signals and mutation methods. It is provided via `InjectionToken<TODOS_STORE>` using `provideTodosStore()` in `TodosComponent`'s own `providers` array — not at the root level. Inject it anywhere inside that subtree with `inject(TODOS_STORE)`.

The store reads `ActivatedRoute` query params as signals (`completedQueryParam`, `sortByDateQueryParam`) and derives `filteredTodos` and sorted `_todos` from them using `computed()`. Filtering and sorting are URL-driven — the footer updates query params via `routerLink` + `queryParamsHandling: 'merge'`, and the store reacts automatically.

Initial data is loaded from `src/assets/todos.json` via `HttpClient` on store construction (not lazy). There is no backend persistence — mutations only affect in-memory signals.

**Routing:**  
`app.routes.ts` → lazy-loads `todos/todo.routes.ts` → lazy-loads `TodosComponent`. Everything redirects to `/todos`.

**Component tree:**

```
TodosComponent          ← hosts the store
  NewTodoComponent      ← emits (addTodo)
  TodoListComponent     ← renders list, delegates events up
    TodoItemComponent   ← inline editing via local signal; emits toggle/update/delete
  TodoFooterComponent   ← filter links + clear-completed
```

All components use `ChangeDetectionStrategy.OnPush`.

## Code Style

Prettier config: 3-space indent, single quotes, 100-char print width, trailing commas (ES5), no semicolons omitted. ESLint enforces blank lines before `return`, `interface`/`type`, block-like statements, and `export` declarations. Component selectors use `app-` prefix (kebab-case); directive selectors use `app` prefix (camelCase).
update CLAUDE.md after any major change and keep it up to date
