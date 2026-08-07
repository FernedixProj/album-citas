import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

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

  {
    path: 'qr/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/qr/qr')
        .then(c => c.Qr)
  },

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