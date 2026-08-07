import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Notification } from './shared/components/notification/notification';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Notification
  ],
  template:`

<app-notification/>

<router-outlet/>

`
})
export class App{}