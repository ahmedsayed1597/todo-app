import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
   selector: 'app-new-todo',
   standalone: true,
   template: `
      <div class="input-row">
         <input
            id="new-todo"
            class="new-todo"
            type="text"
            placeholder="Add a new task..."
            #textInput
            (keyup.enter)="newTodo(textInput.value); textInput.value = ''" />
         <!-- eslint-disable-next-line -->
         <button class="add-btn" title="Add task" (click)="newTodo(textInput.value); textInput.value = ''">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
               <line x1="12" y1="5" x2="12" y2="19"/>
               <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
         </button>
      </div>
   `,
   styles: [
      `
         .input-row {
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 560px;
            gap: 10px;
         }

         .new-todo {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 30px;
            font-size: 15px;
            outline: none;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            box-sizing: border-box;
         }

         .new-todo::placeholder {
            color: #aaa;
         }

         .add-btn {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: #38a169;
            border: none;
            outline: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(56, 161, 105, 0.4);
            transition: background 0.2s, transform 0.1s;
         }

         .add-btn:hover {
            background: #2f855a;
            transform: scale(1.08);
         }

         .add-btn svg {
            width: 22px;
            height: 22px;
            stroke: #fff;
         }
      `,
   ],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTodoComponent {
   @Output() addTodo = new EventEmitter<string>();

   newTodo(text: string) {
      if (text && text.trim()) {
         this.addTodo.emit(text.trim());
      }
   }
}
