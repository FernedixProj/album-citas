import { Component, EventEmitter, Output } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

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

  hasPermission = false;

  cameras: MediaDeviceInfo[] = [];

  currentCamera?: MediaDeviceInfo;

  onCamerasFound(devices: MediaDeviceInfo[]): void {

    this.cameras = devices;

    if (devices.length > 0) {
      this.currentCamera = devices[0];
    }

  }

  onPermissionResponse(permission: boolean): void {

    this.hasPermission = permission;

  }

  onScanSuccess(result: string): void {

    this.scanned.emit(result);

  }

}