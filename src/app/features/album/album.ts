import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ActivityService } from '../../core/services/activity.service';
import { Month } from '../../models/month.model';
import { Activity } from '../../models/activity.model';
import { NotificationService } from '../../core/services/notification.service';


@Component({
  selector: 'app-album',
  imports: [],
  templateUrl: './album.html',
  styleUrl: './album.scss'
})
export class Album implements OnInit {

  private readonly activityService = inject(ActivityService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly months = signal<Month[]>([]);

  async ngOnInit(): Promise<void> {

    const data = await this.activityService.findAll();

    this.months.set(data);

  }

  openActivity(activity: Activity): void {

    if (!activity.isRealizada) {

      this.notificationService.show(
        '🔒 Esta actividad aún no ha sido desbloqueada.',
        'warning'
      );

      return;

    }

    this.router.navigate([
      '/detail',
      activity.id
    ]);

  }

}