import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivityService } from '../../../core/services/activity.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Activity } from '../../../models/activity.model';

@Component({
  selector: 'app-activity-form',
  imports: [
    FormsModule
  ],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.scss'
})
export class ActivityForm implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly activityService = inject(ActivityService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly isEdit = signal(false);

  readonly model = signal<Activity>({
    id: '',
    actividad: '',
    frase: '',
    mes: 'Enero',
    fotoURL: '/fotos/enero.jpg',
    fotoSubidaURL: null,
    isRealizada: false,
    fechaRealizacion: null
  });

  async ngOnInit(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    const activity = await this.activityService.findById(id);

    if (!activity) {

      this.notificationService.show(
        'La actividad no existe.',
        'error'
      );

      this.router.navigate(['/admin']);

      return;

    }

    this.model.set(activity);

    this.isEdit.set(true);

  }

  update<K extends keyof Activity>(
    field: K,
    value: Activity[K]
  ): void {

    this.model.update(activity => ({
      ...activity,
      [field]: value
    }));

  }

  changeMonth(month: string): void {

    this.model.update(activity => ({
      ...activity,
      mes: month,
      fotoURL: `/fotos/${month.toLowerCase()}.jpg`
    }));

  }

  async changeStatus(value: boolean): Promise<void> {

    if (value === this.model().isRealizada) {
      return;
    }

    if (value) {

      this.notificationService.show(
        'La actividad fue marcada como realizada. Recuerda agregar posteriormente la fotografía y la fecha.',
        'info'
      );

      this.update('isRealizada', true);

      return;

    }

    const confirmed =
      await this.confirmationService.confirm(
        'Cambiar estado',
        'La actividad dejará de mostrarse como realizada en el álbum. La fecha y la fotografía permanecerán guardadas. ¿Deseas continuar?',
        'Aceptar'
      );

    if (!confirmed) {
      return;
    }

    this.update('isRealizada', false);

  }

  getDateValue(): string {

    const date = this.model().fechaRealizacion;

    if (!date) {
      return '';
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  changeDate(value: string): void {

    if (!value) {

      this.update(
        'fechaRealizacion',
        null
      );

      return;

    }

    const [year, month, day] =
      value
        .split('-')
        .map(Number);

    this.update(
      'fechaRealizacion',
      new Date(
        year,
        month - 1,
        day
      )
    );

  }
    async save(): Promise<void> {

    const activity = structuredClone(this.model());

    activity.actividad = activity.actividad.trim();
    activity.frase = activity.frase.trim();

    if (activity.actividad.length === 0) {

      this.notificationService.show(
        'La actividad es obligatoria.',
        'warning'
      );

      return;

    }

    if (activity.frase.length === 0) {

      this.notificationService.show(
        'La frase es obligatoria.',
        'warning'
      );

      return;

    }

    if (this.isEdit()) {

      const confirmed =
        await this.confirmationService.confirm(
          'Actualizar actividad',
          '¿Deseas guardar los cambios realizados?',
          'Guardar'
        );

      if (!confirmed) {
        return;
      }

      await this.activityService.update(activity);

      this.notificationService.show(
        'Actividad actualizada correctamente.',
        'success'
      );

    } else {

      activity.isRealizada = false;
      activity.fechaRealizacion = null;
      activity.fotoSubidaURL = null;

      await this.activityService.create(activity);

      this.notificationService.show(
        'Actividad creada correctamente.',
        'success'
      );

    }

    this.router.navigate([
      '/admin'
    ]);

  }

  async clearPhoto(): Promise<void> {

    if (!this.model().fotoSubidaURL) {
      return;
    }

    const confirmed =
      await this.confirmationService.confirm(
        'Eliminar fotografía',
        'La fotografía asociada será eliminada. ¿Deseas continuar?',
        'Eliminar'
      );

    if (!confirmed) {
      return;
    }

    this.update(
      'fotoSubidaURL',
      null
    );

  }

  async clearDate(): Promise<void> {

    if (!this.model().fechaRealizacion) {
      return;
    }

    const confirmed =
      await this.confirmationService.confirm(
        'Eliminar fecha',
        'La fecha de realización será eliminada. ¿Deseas continuar?',
        'Eliminar'
      );

    if (!confirmed) {
      return;
    }

    this.update(
      'fechaRealizacion',
      null
    );

  }

  cancel(): void {

    this.router.navigate([
      '/admin'
    ]);

  }

}