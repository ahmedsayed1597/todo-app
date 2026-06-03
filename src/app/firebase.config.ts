import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
   projectId: 'todo-app-angular-2026',
   appId: '1:1071819621256:web:b766b4cb8f70593cddf03d',
   storageBucket: 'todo-app-angular-2026.firebasestorage.app',
   apiKey: 'AIzaSyBIX3Dz5XCKBwttHK_f2C39kDcclrwIjrA',
   authDomain: 'todo-app-angular-2026.firebaseapp.com',
   messagingSenderId: '1071819621256',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
