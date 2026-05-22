import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            'AIzaSyCUzZrPgdCaiM5o6HpA6x1KbHp1o8u-who',
  authDomain:        'arcade-saves.firebaseapp.com',
  projectId:         'arcade-saves',
  storageBucket:     'arcade-saves.firebasestorage.app',
  messagingSenderId: '93255950338',
  appId:             '1:93255950338:web:0be6e4ff2032613aa8471b',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
