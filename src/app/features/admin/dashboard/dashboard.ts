import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ActivityService } from '../../../core/services/activity.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';

import { Month } from '../../../models/month.model';
import { Activity } from '../../../models/activity.model';

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

  readonly search = signal('');

  readonly selectedMonth = signal('Todos');

  readonly selectedYear = signal('Todos');

  async ngOnInit(): Promise<void> {

    this.months.set(
      await this.activityService.findAll()
    );

  }

  readonly activities = computed(() => {

    return this.months()
      .flatMap(month => month.activities);

  });

  readonly availableMonths = computed(() => [

    'Todos',

    ...this.months().map(month => month.name)

  ]);

  readonly availableYears = computed(() => {

    const years = new Set<string>();

    this.activities().forEach(activity => {

      if (activity.fechaRealizacion) {

        years.add(
          new Date(activity.fechaRealizacion)
            .getFullYear()
            .toString()
        );

      }

    });

    return [

      'Todos',

      ...Array.from(years).sort()

    ];

  });

  readonly filteredActivities = computed(() => {

    let list = [...this.activities()];

    const text = this.search()
      .trim()
      .toLowerCase();

    if (text) {

      list = list.filter(activity =>

        activity.actividad
          .toLowerCase()
          .includes(text)

        ||

        activity.id
          .toLowerCase()
          .includes(text)

        ||

        activity.frase
          .toLowerCase()
          .includes(text)

      );

    }

    if (this.selectedMonth() !== 'Todos') {

      list = list.filter(activity =>

        activity.mes === this.selectedMonth()

      );

    }

    if (this.selectedYear() !== 'Todos') {

      list = list.filter(activity => {

        if (!activity.fechaRealizacion) {

          return false;

        }

        return new Date(activity.fechaRealizacion)
          .getFullYear()
          .toString() === this.selectedYear();

      });

    }

    return list;

  });

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
  formatDate(date: Date | null): string {

  if (!date) {
    return 'Sin fecha';
  }

  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

}

}