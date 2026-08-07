import { Injectable } from '@angular/core';

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
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

    return snapshot.docs.map(document => {

      const data = document.data();

      return {
        id: document.id,
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

  async create(activity: Activity): Promise<void> {

    await setDoc(
      doc(db, 'actividades', activity.id),
      {
        actividad: activity.actividad,
        frase: activity.frase,
        mes: activity.mes,
        fotoURL: activity.fotoURL,
        fotoSubidaURL: activity.fotoSubidaURL,
        isRealizada: activity.isRealizada,
        fechaRealizacion: activity.fechaRealizacion
      }
    );

  }

  async update(activity: Activity): Promise<void> {

    await updateDoc(
      doc(db, 'actividades', activity.id),
      {
        actividad: activity.actividad,
        frase: activity.frase,
        mes: activity.mes,
        fotoURL: activity.fotoURL,
        fotoSubidaURL: activity.fotoSubidaURL,
        isRealizada: activity.isRealizada,
        fechaRealizacion: activity.fechaRealizacion
      }
    );

  }

  async delete(id: string): Promise<void> {

    await deleteDoc(
      doc(db, 'actividades', id)
    );

  }

}