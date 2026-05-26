import {
   ChangeDetectionStrategy,
   Component,
   EventEmitter,
   Input,
   Output,
   signal,
} from '@angular/core';
import { Todo } from '../todos.signal';

@Component({
   selector: 'app-todo-item',
   standalone: true,
   template: `
      <li [class.completed]="todo.completed" [class.editing]="editing()">
         <div class="view">
            <input
               class="toggle"
               type="checkbox"
               [checked]="todo.completed"
               (click)="toggle.emit(todo.id)" />
            <label>{{ todo.text }}</label>
            <!-- eslint-disable-next-line -->
            <button class="edit-btn" title="Edit" (click)="onEditClick(textInput)">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
               </svg>
            </button>
            <!-- eslint-disable-next-line -->
            <button class="destroy" (click)="delete.emit(todo.id)"></button>
         </div>
         <input
            class="edit"
            type="text"
            #textInput
            [hidden]="editing()"
            [value]="todo.text"
            (keyup.enter)="updateText(todo.id, textInput.value)"
            (blur)="updateText(todo.id, textInput.value)" />
      </li>
   `,
   changeDetection: ChangeDetectionStrategy.OnPush,
   styles: [
      `
         :host {
            display: block;
         }

         .toggle,
         .destroy,
         .edit-btn {
            cursor: pointer;
         }

         .edit-btn {
            position: absolute;
            right: 45px;
            top: 0;
            bottom: 0;
            width: 36px;
            display: none;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            padding: 0;
            color: #999;
            transition: color 0.2s;
         }

         .edit-btn svg {
            width: 16px;
            height: 16px;
         }

         .edit-btn:hover {
            color: #555;
         }

         li:hover .edit-btn {
            display: flex;
         }

         li.editing .edit-btn {
            display: none;
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
