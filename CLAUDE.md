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

This is an Angular 16 standalone-components TodoMVC app with no NgModules, backed by Firebase (Firestore + Auth).

### Authentication — `src/app/auth/`

Email/password auth via Firebase Authentication.

- **`auth.service.ts`** — `AuthService` (providedIn root): wraps `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`. Exposes a `user` signal (`User | null | undefined` — `undefined` means still resolving).
- **`auth.guard.ts`** — functional `CanActivateFn`; waits for the first non-`undefined` auth state, then allows or redirects to `/login`.
- **`login.component.ts`** / **`signup.component.ts`** — standalone lazy-loaded pages. Both use `OnPush` + `ChangeDetectorRef.markForCheck()` after `async/await` to ensure error signals render correctly.

### State management — signal-based store (`todos.signal.ts`)

State lives in a factory function (`todosFactory`) that returns a plain object of signals and mutation methods. It is provided via `InjectionToken<TODOS_STORE>` using `provideTodosStore()` in `TodosComponent`'s own `providers` array — not at the root level. Inject it anywhere inside that subtree with `inject(TODOS_STORE)`.

The store reads `ActivatedRoute` query params as signals (`completedQueryParam`, `sortByDateQueryParam`) and derives `filteredTodos` and sorted `_todos` from them using `computed()`. Filtering and sorting are URL-driven — the footer updates query params via `routerLink` + `queryParamsHandling: 'merge'`, and the store reacts automatically.

Data is loaded from Firestore via `onSnapshot` (real-time listener). All mutations (`add`, `toggle`, `update`, `delete`, `clearComplete`) write directly to Firestore. Todos are scoped per user at `users/{uid}/todos`.

### Firebase — `src/app/firebase.config.ts`

Initializes the Firebase app and exports `app` (used by `AuthService`) and `db` (Firestore instance used by the store).

**Project:** `todo-app-angular-2026`

### Routing

`app.routes.ts` → `/login` and `/signup` (lazy), `/todos` (lazy, guarded by `authGuard`). Everything else redirects to `/todos` which bounces to `/login` if unauthenticated.

```
app.routes.ts
  /login   → LoginComponent   (lazy)
  /signup  → SignupComponent  (lazy)
  /todos   → todo.routes.ts   (lazy, authGuard)
               → TodosComponent
```

### Component tree

```
TodosComponent          ← hosts the store; has Sign Out button
  NewTodoComponent      ← emits (addTodo)
  TodoListComponent     ← renders list, delegates events up
    TodoItemComponent   ← inline editing via local signal; emits toggle/update/delete
  TodoFooterComponent   ← filter links + clear-completed
```

All components use `ChangeDetectionStrategy.OnPush`.

### Firestore data model

```
users/{uid}/todos/{docId}
  text:          string
  completed:     boolean
  creationDate:  number  (ms timestamp)
```

Security rules enforce that only the authenticated owner (`request.auth.uid == uid`) can read or write their own todos.

## Code Style

Prettier config: 3-space indent, single quotes, 100-char print width, trailing commas (ES5), no semicolons omitted. ESLint enforces blank lines before `return`, `interface`/`type`, block-like statements, and `export` declarations. Component selectors use `app-` prefix (kebab-case); directive selectors use `app` prefix (camelCase).

update CLAUDE.md after any major change and keep it up to date
