import { Component, inject } from '@angular/core';

import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss'
})
export class ConfirmationDialog {

  readonly confirmation = inject(ConfirmationService);

}