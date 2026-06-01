import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NewTodoComponent } from './components/new-todo.component';
import { TodoFooterComponent } from './components/todo-footer.component';
import { TodoListComponent } from './components/todo-list.component';
import { TODOS_STORE, provideTodosStore } from './todos.signal';

@Component({
   standalone: true,
   template: `
      <div class="app-wrapper">
         <header class="header">
            <h1>My Todos</h1>
            <app-new-todo (addTodo)="todosStore.add($event)" />
         </header>
         <app-todo-list
            *ngIf="todosStore.hasTodos()"
            [todos]="todosStore.todos()"
            (toggle)="todosStore.toggle($event)"
            (update)="todosStore.update($event.id, $event.text)"
            (delete)="todosStore.delete($event)" />
         <app-todo-footer
            *ngIf="todosStore.hasTodos()"
            [hasCompletedTodos]="todosStore.hasCompletedTodos()"
            [incompleteTodosCount]="todosStore.incompleteTodosCount()"
            [currentFilter]="todosStore.completedQueryParam()"
            (clearCompleted)="todosStore.clearComplete()" />
      </div>
   `,
   styles: [
      `
         .app-wrapper {
            min-height: 100vh;
            background: #fff;
            display: flex;
            flex-direction: column;
         }

         .header {
            background: linear-gradient(135deg, #6c63ff 0%, #4facfe 100%);
            padding: 32px 24px 28px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
         }

         h1 {
            margin: 0;
            font-size: 2.4rem;
            font-weight: 700;
            color: #fff;
            letter-spacing: 1px;
         }
      `,
   ],
   providers: [provideTodosStore()],
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [NgIf, NewTodoComponent, TodoListComponent, TodoFooterComponent],
})
export default class TodosComponent {
   readonly todosStore = inject(TODOS_STORE);
}
