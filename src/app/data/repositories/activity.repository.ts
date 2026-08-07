import { Injectable } from '@angular/core';

import {
  collection,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore';

import { db } from '../../core/firebase/firebase';
import { Activity } from '../../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityRepository {

  async findAll(): Promise<Activity[]> {

    const snapshot = await getDocs(
      collection(db, 'actividades')
    );

    return snapshot.docs.map(doc => {

      const data = doc.data();

      return {
        id: doc.id,
        actividad: data['actividad'],
        frase: data['frase'],
        mes: data['mes'],
        fotoURL: data['fotoURL'],
        fotoSubidaURL: data['fotoSubidaURL'],
        isRealizada: data['isRealizada'],
        fechaRealizacion: data['fechaRealizacion']
          ? data['fechaRealizacion'].toDate()
          : null
      };

    });

  }

  async findById(id: string): Promise<Activity | null> {

    const snapshot = await getDoc(
      doc(db, 'actividades', id)
    );

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      id: snapshot.id,
      actividad: data['actividad'],
      frase: data['frase'],
      mes: data['mes'],
      fotoURL: data['fotoURL'],
      fotoSubidaURL: data['fotoSubidaURL'],
      isRealizada: data['isRealizada'],
      fechaRealizacion: data['fechaRealizacion']
        ? data['fechaRealizacion'].toDate()
        : null
    };

  }

}