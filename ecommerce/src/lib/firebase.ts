import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAGHH8_x7Nq1FQOV6l74KrlV9lIhzWqXyg',
  authDomain: 'ecommerce-5051b.firebaseapp.com',
  projectId: 'ecommerce-5051b',
  appId: '1:592009475830:web:ecce61a5cde75dc1ca1ed7',
  // ...other config if needed
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);