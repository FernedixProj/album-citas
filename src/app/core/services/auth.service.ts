import { Injectable, inject, signal } from '@angular/core';

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

  readonly authorizedUser =
    signal<AuthorizedUser | null>(null);

  private ready = false;

  private readyPromise: Promise<void>;

  private resolveReady!: () => void;

  constructor() {

    this.provider.setCustomParameters({
      prompt: 'select_account'
    });

    this.readyPromise = new Promise(resolve => {
      this.resolveReady = resolve;
    });

    onAuthStateChanged(auth, async user => {

      if (!user) {

        this.authorizedUser.set(null);

      } else {

        let authorizedUser =
          await this.repository.getAuthorizedUser(
            user.uid
          );

        if (!authorizedUser) {

          authorizedUser =
            await this.repository.createGuest(
              user.uid,
              user.email ?? ''
            );

        }

        this.authorizedUser.set(
          authorizedUser
        );

      }

      if (!this.ready) {

        this.ready = true;

        this.resolveReady();

      }

    });

  }

  async waitUntilReady(): Promise<void> {

    if (this.ready) {
      return;
    }

    await this.readyPromise;

  }

  async login(): Promise<User | null> {

    const credential =
      await signInWithPopup(
        auth,
        this.provider
      );

    return credential.user;

  }

  currentUser(): User | null {

    return auth.currentUser;

  }

  getAuthorizedUser(): AuthorizedUser | null {

    return this.authorizedUser();

  }

  isAuthorized(): boolean {

    return this.authorizedUser()?.active === true;

  }

  isAdmin(): boolean {

    return this.authorizedUser()?.role === 'admin';

  }

  isEditor(): boolean {

    return this.authorizedUser()?.role === 'editor';

  }

  isGuest(): boolean {

    return this.authorizedUser()?.role === 'guest';

  }

  canComplete(): boolean {

    return this.isAdmin() || this.isEditor();

  }

  canAccessDashboard(): boolean {

    return this.isAdmin();

  }

  async logout(): Promise<void> {

    this.authorizedUser.set(null);

    this.ready = false;

    this.readyPromise = new Promise(resolve => {
      this.resolveReady = resolve;
    });

    await signOut(auth);

  }

}