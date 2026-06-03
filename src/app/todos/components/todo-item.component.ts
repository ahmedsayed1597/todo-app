import {
   ChangeDetectionStrategy,
   Component,
   EventEmitter,
   Input,
   Output,
   signal,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { Todo } from '../todos.signal';

@Component({
   selector: 'app-todo-item',
   standalone: true,
   imports: [NgIf],
   template: `
      <div class="todo-card" [class.completed]="todo.completed">
         <div class="card-top" *ngIf="!editing()">
            <input
               class="toggle"
               type="checkbox"
               [checked]="todo.completed"
               (click)="toggle.emit(todo.id)" />
            <span class="todo-text">{{ todo.text }}</span>
         </div>
         <input
            class="edit-input"
            type="text"
            #textInput
            [hidden]="!editing()"
            [value]="todo.text"
            (keyup.enter)="updateText(todo.id, textInput.value)"
            (keyup.escape)="editing.set(false)"
            (blur)="updateText(todo.id, textInput.value)" />
         <div class="card-actions" *ngIf="!editing()">
            <!-- eslint-disable-next-line -->
            <button class="edit-btn" title="Edit" (click)="onEditClick(textInput)">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
               </svg>
               Edit
            </button>
            <!-- eslint-disable-next-line -->
            <button class="delete-btn" title="Delete" (click)="delete.emit(todo.id)">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/>
                  <path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
               </svg>
               Delete
            </button>
         </div>
      </div>
   `,
   changeDetection: ChangeDetectionStrategy.OnPush,
   styles: [
      `
         :host {
            display: block;
         }

         .todo-card {
            background: #fafafa;
            border-radius: 12px;
            border-left: 4px solid #6c63ff;
            box-shadow:
               0 2px 4px rgba(0, 0, 0, 0.06),
               0 6px 16px rgba(0, 0, 0, 0.08);
            padding: 18px 20px 18px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: box-shadow 0.2s, transform 0.2s;
            min-height: 120px;
         }

         .todo-card:hover {
            box-shadow:
               0 4px 8px rgba(0, 0, 0, 0.08),
               0 12px 28px rgba(108, 99, 255, 0.14);
            transform: translateY(-3px);
         }

         .todo-card.completed {
            border-left-color: #48bb78;
            background: #f7fdf9;
         }

         .todo-card.completed .todo-text {
            text-decoration: line-through;
            color: #9ca3af;
         }

         .card-top {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            flex: 1;
         }

         .toggle {
            margin-top: 3px;
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #6c63ff;
            flex-shrink: 0;
         }

         .todo-text {
            font-size: 15px;
            font-weight: 500;
            color: #1a1a2e;
            line-height: 1.5;
            word-break: break-word;
         }

         .card-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
         }

         .edit-btn,
         .delete-btn {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 14px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: background 0.2s, transform 0.1s;
         }

         .edit-btn:hover,
         .delete-btn:hover {
            transform: translateY(-1px);
         }

         .edit-btn svg,
         .delete-btn svg {
            width: 14px;
            height: 14px;
         }

         .edit-btn {
            background: #ede9fe;
            color: #6c63ff;
         }

         .edit-btn:hover {
            background: #ddd6fe;
         }

         .delete-btn {
            background: #fee2e2;
            color: #dc2626;
         }

         .delete-btn:hover {
            background: #fecaca;
         }

         .edit-input {
            width: 100%;
            padding: 8px 10px;
            border: 2px solid #6c63ff;
            border-radius: 8px;
            font-size: 15px;
            outline: none;
            box-sizing: border-box;
            background: #fff;
            color: #1a1a2e;
         }
      `,
   ],
})
export class TodoItemComponent {
   @Input({ required: true }) todo!: Todo;
   @Output() toggle = new EventEmitter<string>();
   @Output() update = new EventEmitter<{ id: string; text: string }>();
   @Output() delete = new EventEmitter<string>();

   editing = signal(false);

   updateText(id: string, text: string) {
      if (text && text.trim() !== this.todo?.text) {
         this.update.emit({ id, text: text.trim() });
      }

      this.editing.set(false);
   }

   onEditClick(input: HTMLInputElement) {
      this.editing.set(true);

      setTimeout(() => {
         input.focus();
      }, 0);
   }
}
