import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ActivityService } from '../../core/services/activity.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';

import { Month } from '../../models/month.model';
import { Activity } from '../../models/activity.model';

import { QrScanner } from '../../shared/components/qr-scanner/qr-scanner';

@Component({
  selector: 'app-album',
  imports: [
    QrScanner
  ],
  templateUrl: './album.html',
  styleUrl: './album.scss'
})
export class Album implements OnInit {

  private readonly activityService = inject(ActivityService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly months = signal<Month[]>([]);

  readonly showScanner = signal(false);

  readonly scanning = signal(false);

  readonly showMenu = signal(false);

  async ngOnInit(): Promise<void> {

    const data = await this.activityService.findAll();

    this.months.set(data);

  }

  openScanner(): void {

    this.scanning.set(true);

    this.showScanner.set(true);

  }

  closeScanner(): void {

    this.scanning.set(false);

    this.showScanner.set(false);

  }

  onQrScanned(id: string): void {

    if (!this.scanning()) {
      return;
    }

    this.scanning.set(false);

    this.showScanner.set(false);

    if ('vibrate' in navigator) {

      navigator.vibrate(80);

    }

    this.router.navigate([
      '/qr',
      id
    ]);

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

  toggleMenu(): void {

    this.showMenu.update(value => !value);

  }

  closeMenu(): void {

    this.showMenu.set(false);

  }

  async logout(): Promise<void> {

    try {

      this.closeMenu();

      await this.authService.logout();

      this.notificationService.show(
        'Hasta pronto ❤️',
        'success'
      );

      this.router.navigate([
        '/login'
      ]);

    } catch {

      this.notificationService.show(
        'No fue posible cerrar la sesión.',
        'error'
      );

    }

  }

}