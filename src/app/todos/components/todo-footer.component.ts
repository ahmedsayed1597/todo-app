import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoFilter } from '../todos.signal';

@Component({
   selector: 'app-todo-footer',
   standalone: true,
   template: `
      <footer class="footer">
         <span class="todo-count">{{ incompleteTodosCount }} items left</span>
         <ul class="filters">
            <li>
               <a
                  routerLink="/"
                  [queryParams]="{ completed: null }"
                  queryParamsHandling="merge"
                  [class.selected]="!currentFilter"
                  >All</a
               >
            </li>
            <li>
               <a
                  routerLink="/"
                  [queryParams]="{ completed: 'false' }"
                  queryParamsHandling="merge"
                  [class.selected]="currentFilter === 'false'"
                  >Active</a
               >
            </li>
            <li>
               <a
                  routerLink="/"
                  [queryParams]="{ completed: 'true' }"
                  queryParamsHandling="merge"
                  [class.selected]="currentFilter === 'true'"
                  >Completed</a
               >
            </li>
         </ul>
         <div class="footer-right">
            <button
               *ngIf="hasCompletedTodos"
               class="clear-completed"
               (click)="clearCompleted.emit()">
               Clear completed
            </button>
         </div>
      </footer>
   `,
   styles: [
      `
         .footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 14px 24px;
            background: #38a169;
            border-top: none;
            font-size: 14px;
            color: #fff;
            gap: 10px;
            position: sticky;
            bottom: 0;
         }

         .todo-count {
            white-space: nowrap;
         }

         .filters {
            display: flex;
            list-style: none;
            gap: 4px;
            justify-content: center;
            flex-wrap: nowrap;
         }

         .filters li {
            flex-shrink: 0;
         }

         .filters a {
            display: block;
            padding: 5px 14px;
            border-radius: 20px;
            text-decoration: none;
            color: #fff;
            border: 1px solid transparent;
            white-space: nowrap;
            transition: border-color 0.15s, background 0.15s;
         }

         .filters a:hover {
            border-color: rgba(255, 255, 255, 0.6);
         }

         .filters a.selected {
            border-color: #fff;
            background: rgba(255, 255, 255, 0.2);
            font-weight: 600;
         }

         .footer-right {
            display: flex;
            justify-content: flex-end;
         }

         .clear-completed {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            font-size: 13px;
            text-decoration: underline;
            padding: 4px 0;
            white-space: nowrap;
         }

         .clear-completed:hover {
            color: #fff;
         }

      `,
   ],
   imports: [RouterLink, NgIf],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFooterComponent {
   @Input() hasCompletedTodos = false;
   @Input() incompleteTodosCount = 0;
   @Input() currentFilter?: TodoFilter;
   @Output() clearCompleted = new EventEmitter();
}
