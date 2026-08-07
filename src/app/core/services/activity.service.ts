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

  async findById(id: string): Promise<Activity | null> {

    return this.repository.findById(id);

  }

  async create(activity: Activity): Promise<void> {

    activity.id = await this.generateId(activity.mes);

    await this.repository.create(activity);

  }

  async update(activity: Activity): Promise<void> {

    await this.repository.update(activity);

  }

  async delete(id: string): Promise<void> {

    await this.repository.delete(id);

  }

  private async generateId(month: string): Promise<string> {

    const activities = await this.repository.findAll();

    const prefix = month.substring(0,3).toLowerCase();

    const total = activities.filter(a => a.mes === month).length + 1;

    return `${prefix}${total.toString().padStart(2,'0')}`;

  }

}