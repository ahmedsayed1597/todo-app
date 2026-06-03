import { Routes } from '@angular/router'
import { authGuard } from './auth/auth.guard'

export const routes: Routes = [
   {
      path: 'login',
      loadComponent: () => import('./auth/login.component'),
   },
   {
      path: 'signup',
      loadComponent: () => import('./auth/signup.component'),
   },
   {
      path: 'todos',
      loadChildren: () => import('./todos/todo.routes'),
      canActivate: [authGuard],
   },
   { path: '**', redirectTo: 'todos', pathMatch: 'full' },
]
