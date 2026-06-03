import { DestroyRef, InjectionToken, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs'
import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   onSnapshot,
   updateDoc,
   writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase.config'

export interface Todo {
   id: string
   text: string
   creationDate: number
   completed: boolean
}

export enum TodoFilter {
   ACTIVE = 'false',
   COMPLETED = 'true',
}

function todosFactory(route = inject(ActivatedRoute), destroyRef = inject(DestroyRef)) {
   const todos = signal<Todo[]>([])
   const hasTodos = computed(() => todos().length > 0)
   const hasCompletedTodos = computed(() => todos().some(todo => todo.completed))
   const completedQueryParam = toSignal(route.queryParams.pipe(map(q => q['completed'])))
   const sortByDateQueryParam = toSignal(route.queryParams.pipe(map(q => q['sortByDate'])))

   const filteredTodos = computed(() => {
      switch (completedQueryParam()) {
         case TodoFilter.ACTIVE:
            return todos().filter(todo => !todo.completed)
         case TodoFilter.COMPLETED:
            return todos().filter(todo => todo.completed)
         default:
            return todos()
      }
   })

   const incompleteTodosCount = computed(() => filteredTodos().length)

   const _todos = computed(() => {
      switch (sortByDateQueryParam()) {
         default:
         case 'asc':
            return filteredTodos().sort((a, b) => b.creationDate - a.creationDate)
         case 'desc':
            return filteredTodos().sort((a, b) => a.creationDate - b.creationDate)
      }
   })

   const todosCol = collection(db, 'todos')
   const unsubscribe = onSnapshot(todosCol, snapshot => {
      todos.set(snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Todo, 'id'>) })))
   })
   destroyRef.onDestroy(unsubscribe)

   return {
      completedQueryParam,
      todos: _todos,
      hasTodos,
      hasCompletedTodos,
      incompleteTodosCount,
      add: (text: string) => {
         addDoc(todosCol, { text, creationDate: new Date().getTime(), completed: false })
      },
      toggle: (id: string) => {
         const todo = todos().find(t => t.id === id)
         if (todo) updateDoc(doc(db, 'todos', id), { completed: !todo.completed })
      },
      delete: (id: string) => {
         deleteDoc(doc(db, 'todos', id))
      },
      update: (id: string, text: string) => {
         updateDoc(doc(db, 'todos', id), { text })
      },
      clearComplete: () => {
         const batch = writeBatch(db)
         todos()
            .filter(t => t.completed)
            .forEach(t => batch.delete(doc(db, 'todos', t.id)))
         batch.commit()
      },
   }
}

export const TODOS_STORE = new InjectionToken<ReturnType<typeof todosFactory>>(
   'TodosStore with Signals'
)

export function provideTodosStore() {
   return { provide: TODOS_STORE, useFactory: todosFactory }
}
