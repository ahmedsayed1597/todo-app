import { NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../auth/auth.service'
import { NewTodoComponent } from './components/new-todo.component'
import { TodoFooterComponent } from './components/todo-footer.component'
import { TodoListComponent } from './components/todo-list.component'
import { TODOS_STORE, provideTodosStore } from './todos.signal'

@Component({
   standalone: true,
   template: `
      <div class="app-wrapper">
         <header class="header">
            <div class="header-top">
               <h1>My Todos</h1>
               <button class="logout-btn" (click)="logout()">Sign Out</button>
            </div>
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
            background: #f4f4f8;
            display: flex;
            flex-direction: column;
         }

         .header {
            background: linear-gradient(135deg, #6c63ff 0%, #4facfe 100%);
            padding: 32px 24px 28px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
         }

         .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
         }

         h1 {
            margin: 0;
            font-size: 2.4rem;
            font-weight: 700;
            color: #fff;
            letter-spacing: 1px;
         }

         .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
            border: 1.5px solid rgba(255, 255, 255, 0.5);
            border-radius: 8px;
            padding: 6px 14px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
         }

         .logout-btn:hover {
            background: rgba(255, 255, 255, 0.35);
         }
      `,
   ],
   providers: [provideTodosStore()],
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [NgIf, NewTodoComponent, TodoListComponent, TodoFooterComponent],
})
export default class TodosComponent {
   readonly todosStore = inject(TODOS_STORE)
   private auth = inject(AuthService)
   private router = inject(Router)

   async logout() {
      await this.auth.logout()
      this.router.navigate(['/login'])
   }
}
