import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  inject
} from '@angular/core';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BrowserQRCodeReader } from '@zxing/browser';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [
    ZXingScannerModule
  ],
  templateUrl: './qr-scanner.html',
  styleUrl: './qr-scanner.scss'
})
export class QrScanner {

  @Output()
  scanned = new EventEmitter<string>();

  @ViewChild('imageInput')
  imageInput?: ElementRef<HTMLInputElement>;

  hasPermission = false;

  cameras: MediaDeviceInfo[] = [];

  currentCamera?: MediaDeviceInfo;

  loadingImage = false;

  private readonly imageReader =
    new BrowserQRCodeReader();
    
  private readonly notificationService = inject(NotificationService);

  onCamerasFound(
    devices: MediaDeviceInfo[]
  ): void {

    this.cameras = devices;

    if (devices.length > 0) {

      this.currentCamera = devices[0];

    }

  }

  onPermissionResponse(
    permission: boolean
  ): void {

    this.hasPermission = permission;

  }

  onScanSuccess(
    result: string
  ): void {

    this.scanned.emit(result);

  }

  selectImage(): void {

    this.imageInput?.nativeElement.click();

  }

  async onImageSelected(
    event: Event
  ): Promise<void> {

    const input =
      event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {

      return;

    }

    this.loadingImage = true;

    try {

      const image = new Image();

      image.src = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {

        image.onload = () => resolve();

        image.onerror = reject;

      });

      const result =
        await this.imageReader.decodeFromImageElement(
          image
        );

      URL.revokeObjectURL(image.src);

      this.scanned.emit(
        result.getText()
      );

    } catch {

      this.notificationService.show(
        'No se encontró un código QR en la imagen.',
        'warning'
      );

    } finally {

      this.loadingImage = false;

      input.value = '';

    }

  }

}