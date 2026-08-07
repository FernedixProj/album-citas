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
import { AuthorizedUser } from '../../models/authorized-user.model';

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

  async getAuthorizedUser(): Promise<AuthorizedUser | null> {

    const user = await this.currentUser();

    if (!user) {
      return null;
    }

    return this.repository.getAuthorizedUser(user.uid);

  }

  async isAuthorized(): Promise<boolean> {

    const authorizedUser = await this.getAuthorizedUser();

    return authorizedUser?.active === true;

  }

  logout(): Promise<void> {

    return signOut(auth);

  }

}