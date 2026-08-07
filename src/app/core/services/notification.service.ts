import { Injectable, signal } from '@angular/core';

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly visible = signal(false);

  readonly message = signal('');

  readonly type = signal<NotificationType>('info');

  show(
    message: string,
    type: NotificationType = 'info'
  ): void {

    this.message.set(message);

    this.type.set(type);

    this.visible.set(true);

    setTimeout(() => {

      this.visible.set(false);

    },3000);

  }

}