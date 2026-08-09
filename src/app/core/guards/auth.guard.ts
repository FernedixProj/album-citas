import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperar a que Firebase restaure la sesión
  await authService.waitUntilReady();

  if (authService.isAuthorized()) {

    return true;

  }

  return router.parseUrl('/login');

};