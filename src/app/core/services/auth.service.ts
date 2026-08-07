import { Injectable, inject } from '@angular/core';

import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';

import { auth } from '../firebase/firebase';
import { AuthRepository } from '../../data/repositories/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly repository = inject(AuthRepository);
  private readonly provider = new GoogleAuthProvider();

  async login(): Promise<User | null> {

    const credential = await signInWithPopup(
      auth,
      this.provider
    );

    return credential.user;

  }

  currentUser(): Promise<User | null> {

    return new Promise(resolve => {

      const unsubscribe = onAuthStateChanged(auth, user => {

        unsubscribe();

        resolve(user);

      });

    });

  }

  async isAuthorized(): Promise<boolean> {

    const user = await this.currentUser();

    if (!user) {
      return false;
    }

    const authorizedUser = await this.repository.getAuthorizedUser(
      user.uid
    );

    return authorizedUser?.active === true;

  }

  logout(): Promise<void> {

    return signOut(auth);

  }

}