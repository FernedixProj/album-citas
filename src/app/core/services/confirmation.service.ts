import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  readonly visible = signal(false);

  readonly title = signal('');

  readonly message = signal('');

  readonly acceptText = signal('Aceptar');

  private resolver?: (value: boolean) => void;

  confirm(
    title: string,
    message: string,
    acceptText = 'Aceptar'
  ): Promise<boolean> {

    this.title.set(title);
    this.message.set(message);
    this.acceptText.set(acceptText);
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