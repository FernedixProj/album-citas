import { Injectable } from '@angular/core';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import { db } from '../../core/firebase/firebase';
import { AuthorizedUser } from '../../models/authorized-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthRepository {

  async getAuthorizedUser(uid: string): Promise<AuthorizedUser | null> {

    const document = await getDoc(
      doc(db, 'authorizedUsers', uid)
    );

    if (!document.exists()) {
      return null;
    }

    return document.data() as AuthorizedUser;

  }

}