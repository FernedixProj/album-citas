import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ActivityService } from '../../../core/services/activity.service';
import { Month } from '../../../models/month.model';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private readonly activityService = inject(ActivityService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly months = signal<Month[]>([]);

  async ngOnInit(): Promise<void> {

    this.months.set(
      await this.activityService.findAll()
    );

  }

  create(): void {

    this.router.navigate([
      '/admin/new'
    ]);

  }

  edit(id: string): void {

    this.router.navigate([
      '/admin/edit',
      id
    ]);

  }

 async delete(id: string): Promise<void> {

  const confirmed =
    await this.confirmationService.confirm(
      'Eliminar actividad',
      '¿Deseas eliminar esta actividad?'
    );

  if (!confirmed) {
    return;
  }

  await this.activityService.delete(id);

  this.months.set(
    await this.activityService.findAll()
  );

}
}