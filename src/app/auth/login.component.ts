import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core'
import { NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from './auth.service'

@Component({
   standalone: true,
   selector: 'app-login',
   imports: [NgIf, FormsModule, RouterLink],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
      <div class="page">
         <div class="card">
            <div class="card-header">
               <h1>My Todos</h1>
               <p>Sign in to your account</p>
            </div>
            <div class="card-body">
               <div *ngIf="error()" class="error">{{ error() }}</div>
               <form (ngSubmit)="submit()">
                  <label>Email</label>
                  <input
                     type="email"
                     [(ngModel)]="email"
                     name="email"
                     placeholder="you@example.com"
                     required
                     autocomplete="email" />
                  <label>Password</label>
                  <input
                     type="password"
                     [(ngModel)]="password"
                     name="password"
                     placeholder="••••••••"
                     required
                     autocomplete="current-password" />
                  <button type="submit" [disabled]="loading()">
                     {{ loading() ? 'Signing in…' : 'Sign In' }}
                  </button>
               </form>
               <p class="switch">
                  Don't have an account? <a routerLink="/signup">Sign Up</a>
               </p>
            </div>
         </div>
      </div>
   `,
   styles: [
      `
         .page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
         }
         .card {
            width: 100%;
            max-width: 400px;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(108, 99, 255, 0.12);
         }
         .card-header {
            background: linear-gradient(135deg, #6c63ff 0%, #4facfe 100%);
            padding: 32px 28px 24px;
            color: #fff;
         }
         .card-header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 4px;
         }
         .card-header p {
            opacity: 0.85;
            font-size: 0.95rem;
         }
         .card-body {
            padding: 28px;
         }
         .error {
            background: #fff0f0;
            color: #d32f2f;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 0.875rem;
            margin-bottom: 16px;
         }
         label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: #555;
            margin-bottom: 6px;
            margin-top: 16px;
         }
         label:first-of-type {
            margin-top: 0;
         }
         input {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid #e0e0e0;
            border-radius: 8px;
            font-size: 0.95rem;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s;
         }
         input:focus {
            border-color: #6c63ff;
         }
         button {
            width: 100%;
            margin-top: 24px;
            padding: 12px;
            background: linear-gradient(135deg, #6c63ff 0%, #4facfe 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
         }
         button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
         }
         .switch {
            text-align: center;
            margin-top: 20px;
            font-size: 0.875rem;
            color: #777;
         }
         .switch a {
            color: #6c63ff;
            font-weight: 600;
            text-decoration: none;
         }
      `,
   ],
})
export default class LoginComponent {
   private auth = inject(AuthService)
   private router = inject(Router)
   private cdr = inject(ChangeDetectorRef)

   email = ''
   password = ''
   loading = signal(false)
   error = signal('')

   async submit() {
      this.error.set('')
      this.loading.set(true)
      try {
         await this.auth.login(this.email, this.password)
         this.router.navigate(['/todos'])
      } catch (e: any) {
         this.error.set(this.friendlyError(e.code))
         this.cdr.markForCheck()
      } finally {
         this.loading.set(false)
         this.cdr.markForCheck()
      }
   }

   private friendlyError(code: string): string {
      switch (code) {
         case 'auth/user-not-found':
         case 'auth/wrong-password':
         case 'auth/invalid-credential':
            return 'Invalid email or password.'
         case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.'
         default:
            return 'Something went wrong. Please try again.'
      }
   }
}
