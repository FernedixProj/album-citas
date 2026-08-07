import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard: CanActivateFn = async () => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const user = await authService.getAuthorizedUser();

  if (!user) {

    router.navigate(['/login']);

    return false;

  }

  if (user.role !== 'admin') {

    notificationService.show(
      'No tienes permisos para acceder a esta sección.',
      'error'
    );

    router.navigate(['/album']);

    return false;

  }

  return true;

};