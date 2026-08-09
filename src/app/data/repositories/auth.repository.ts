import { Injectable } from '@angular/core';

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

import { db } from '../../core/firebase/firebase';
import { AuthorizedUser } from '../../models/authorized-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthRepository {

  async getAuthorizedUser(
    uid: string
  ): Promise<AuthorizedUser | null> {

    const document = await getDoc(
      doc(db, 'authorizedUsers', uid)
    );

    if (!document.exists()) {
      return null;
    }

    return document.data() as AuthorizedUser;

  }

  async createGuest(
    uid: string,
    email: string
  ): Promise<AuthorizedUser> {

    const user: AuthorizedUser = {
      uid,
      email,
      active: true,
      role: 'guest'
    };

    await setDoc(
      doc(db, 'authorizedUsers', uid),
      {
        ...user,
        createdAt: serverTimestamp()
      }
    );

    return user;

  }

}