import { Injectable, signal } from '@angular/core'
import {
   createUserWithEmailAndPassword,
   getAuth,
   onAuthStateChanged,
   signInWithEmailAndPassword,
   signOut,
   User,
} from 'firebase/auth'
import { app } from '../firebase.config'

@Injectable({ providedIn: 'root' })
export class AuthService {
   private auth = getAuth(app)

   /** undefined = still resolving, null = logged out, User = logged in */
   readonly user = signal<User | null | undefined>(undefined)

   constructor() {
      onAuthStateChanged(this.auth, user => this.user.set(user))
   }

   signUp(email: string, password: string) {
      return createUserWithEmailAndPassword(this.auth, email, password)
   }

   login(email: string, password: string) {
      return signInWithEmailAndPassword(this.auth, email, password)
   }

   logout() {
      return signOut(this.auth)
   }
}
