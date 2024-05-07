import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffAttendanceRoutingModule } from './staff-attendance-routing.module';
import { StaffAttendanceComponent } from './staff-attendance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [
    StaffAttendanceComponent
  ],
  imports: [
    CommonModule,
    StaffAttendanceRoutingModule,
    SharedModule,
    CheckboxModule
  ]
})
export class StaffAttendanceModule { }
