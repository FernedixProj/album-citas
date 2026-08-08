import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivityService } from '../../core/services/activity.service';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-detail',
  imports: [
    
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly activityService = inject(ActivityService);

  readonly activity = signal<Activity | undefined>(undefined);

  async ngOnInit(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.router.navigate(['/album']);

      return;

    }

    const activity = await this.activityService.findById(id);

    if (!activity) {

      this.router.navigate(['/album']);

      return;

    }

    if (!activity.isRealizada) {

      this.router.navigate(['/album']);

      return;

    }

    this.activity.set(activity);

  }

  back(): void {

    this.router.navigate(['/album']);

  }
  formatDate(date: any): string {

  if (!date) {
    return '';
  }

  const value = date.toDate ? date.toDate() : new Date(date);

  return value.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

}

}