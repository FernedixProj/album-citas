import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(false);

  async ngOnInit(): Promise<void> {

    this.loading.set(true);

    try {

      const user = await this.authService.currentUser();

      if (!user) {
        return;
      }

      const authorized = await this.authService.isAuthorized();

      if (authorized) {

        this.router.navigate([
          '/album'
        ]);

      } else {

        await this.authService.logout();

      }

    } finally {

      this.loading.set(false);

    }

  }

  async login(): Promise<void> {

    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {

      const user = await this.authService.login();

      if (!user) {

        this.notificationService.show(
          'No fue posible iniciar sesión.',
          'error'
        );

        return;

      }

      const authorized = await this.authService.isAuthorized();

      if (!authorized) {

        await this.authService.logout();

        this.notificationService.show(
          'Tu cuenta no está autorizada para acceder a este álbum.',
          'warning'
        );

        return;

      }

      this.notificationService.show(
        `Bienvenido ${user.displayName ?? ''} ❤️`,
        'success'
      );

      this.router.navigate([
        '/album'
      ]);

    } catch (error) {
       alert(JSON.stringify(error));

  console.error(error);
      this.notificationService.show(
        'Ocurrió un error al iniciar sesión.',
        'error'
      );

    } finally {

      this.loading.set(false);

    }

  }

}