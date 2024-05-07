import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffHolidayRoutingModule } from './staff-holiday-routing.module';
import { StaffHolidayComponent } from './staff-holiday.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
@NgModule({
  declarations: [
    StaffHolidayComponent
  ],
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, ToastModule, DialogModule,TabViewModule,StaffHolidayRoutingModule ]

})
export class StaffHolidayModule { }
