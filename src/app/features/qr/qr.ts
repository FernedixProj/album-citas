import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivityService } from '../../core/services/activity.service';
import { AuthService } from '../../core/services/auth.service';

import { Activity } from '../../models/activity.model';

type QrState =
  | 'loading'
  | 'new'
  | 'pending'
  | 'memory'
  | 'locked'
  | 'invalid';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.html',
  styleUrl: './qr.scss'
})
export class Qr implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly activityService = inject(ActivityService);
  private readonly authService = inject(AuthService);

  readonly state = signal<QrState>('loading');

  readonly activity = signal<Activity | null>(null);

  readonly progress = signal(0);

  async ngOnInit(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.state.set('invalid');

      return;

    }

    const activity =
      await this.activityService.findById(id);

    if (!activity) {

      this.state.set('invalid');

      return;

    }

    this.activity.set(activity);

    // Primera vez
    if (!activity.isRealizada) {

      // Solo admin y editor pueden completar automáticamente
      if (this.authService.canComplete()) {

        activity.isRealizada = true;

        await this.activityService.update(activity);

        this.state.set('new');

        this.startProgress(10);

      } else {

        // Invitado: no puede desbloquear la actividad
        this.state.set('locked');

      }

      return;

    }

    // Ya desbloqueada pero aún sin recuerdos
    if (!activity.fotoSubidaURL) {

      this.state.set('pending');

      this.startProgress(10);

      return;

    }

    // Ya tiene recuerdos
    this.state.set('memory');

    this.startProgress(10);

  }

  private startProgress(seconds: number): void {

    const total = seconds * 10;

    let current = 0;

    const timer = setInterval(() => {

      current++;

      this.progress.set(
        current / total * 100
      );

      if (current >= total) {

        clearInterval(timer);

        this.goToDetail();

      }

    }, 100);

  }

  goToDetail(): void {

    const activity = this.activity();

    if (!activity) {

      this.backToAlbum();

      return;

    }

    this.router.navigate([
      '/detail',
      activity.id
    ]);

  }

  backToAlbum(): void {

    this.router.navigate([
      '/album'
    ]);

  }

}