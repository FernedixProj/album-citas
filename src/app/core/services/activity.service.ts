import { Injectable, inject } from '@angular/core';

import { ActivityRepository } from '../../data/repositories/activity.repository';
import { Activity } from '../../models/activity.model';
import { Month } from '../../models/month.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private readonly repository = inject(ActivityRepository);

  async findAll(): Promise<Month[]> {

    const activities = await this.repository.findAll();

    const months = new Map<string, Activity[]>();

    for (const activity of activities) {

      if (!months.has(activity.mes)) {

        months.set(activity.mes, []);

      }

      months.get(activity.mes)!.push(activity);

    }

    return Array.from(months.entries()).map(([name, activities]) => ({
      name,
      activities
    }));

  }
  async findById(id: string): Promise<Activity | null>{

    return this.repository.findById(id);

}

}