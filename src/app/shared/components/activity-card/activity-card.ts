import { Component, input } from '@angular/core';

import { Activity } from '../../../models/activity.model';

@Component({
  selector: 'app-activity-card',
  imports: [],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss'
})
export class ActivityCard {

  activity = input.required<Activity>();

}