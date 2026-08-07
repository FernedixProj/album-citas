import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Notification } from './shared/components/notification/notification';
import { ConfirmationDialog } from './shared/components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Notification,
    ConfirmationDialog
  ],
  template:`

<app-notification/>

<app-confirmation-dialog/>

<router-outlet/>

`
})
export class App {}