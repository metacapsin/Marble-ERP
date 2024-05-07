import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffLeaveRoutingModule } from './staff-leave-routing.module';
import { StaffLeaveComponent } from './staff-leave.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';



@NgModule({
  declarations: [
    StaffLeaveComponent
  ],
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, ToastModule, DialogModule,TabViewModule,StaffLeaveRoutingModule ]

})
export class StaffLeaveModule { }
