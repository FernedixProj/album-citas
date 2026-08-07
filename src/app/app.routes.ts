import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'album',
    pathMatch: 'full'
  },

  {
    path: 'album',
    loadComponent: () =>
      import('./features/album/album')
        .then(c => c.Album)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login')
        .then(c => c.Login)
  },

  // ==========================
  // ADMINISTRACIÓN
  // ==========================

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard')
        .then(c => c.Dashboard)
  },

  {
    path: 'admin/new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/activity-form/activity-form')
        .then(c => c.ActivityForm)
  },

  {
    path: 'admin/edit/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/activity-form/activity-form')
        .then(c => c.ActivityForm)
  },

  // ==========================
  // QR
  // ==========================

  {
    path: 'qr/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/qr/qr')
        .then(c => c.Qr)
  },

  // ==========================
  // DETALLE
  // ==========================

  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./features/detail/detail')
        .then(c => c.Detail)
  },

  {
    path: '**',
    redirectTo: 'album'
  }

];