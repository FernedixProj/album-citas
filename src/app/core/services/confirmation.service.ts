import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  readonly visible = signal(false);

  readonly title = signal('');

  readonly message = signal('');

  private resolver?: (value: boolean) => void;

  confirm(title: string, message: string): Promise<boolean> {

    this.title.set(title);
    this.message.set(message);
    this.visible.set(true);

    return new Promise(resolve => {

      this.resolver = resolve;

    });

  }

  accept(): void {

    this.visible.set(false);

    this.resolver?.(true);

  }

  cancel(): void {

    this.visible.set(false);

    this.resolver?.(false);

  }

}