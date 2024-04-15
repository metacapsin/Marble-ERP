import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarSettingsRoutingModule } from './calendar-settings-routing.module';
import { CalendarSettingsHomeComponent } from './calendar-settings-home/calendar-settings-home.component';
import { CalendarSettingsEditHoursDialogComponent } from './calendar-settings-edit-hours-dialog/calendar-settings-edit-hours-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    
    CalendarSettingsEditHoursDialogComponent
  ],
  imports: [
    CommonModule,
    CalendarSettingsHomeComponent,
    CalendarSettingsRoutingModule,
    SharedModule
  ],
})
export class CalendarSettingsModule { }
