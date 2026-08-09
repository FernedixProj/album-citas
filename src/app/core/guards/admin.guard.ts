import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard: CanActivateFn = async () => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  // Esperar a que Firebase restaure la sesión
  await authService.waitUntilReady();

  // No hay sesión o el usuario está deshabilitado
  if (!authService.isAuthorized()) {

    return router.parseUrl('/login');

  }

  // Tiene sesión pero no es administrador
  if (!authService.isAdmin()) {

    notificationService.show(
      'No tienes permisos para acceder a esta sección.',
      'warning'
    );

    return router.parseUrl('/album');

  }

  return true;

};