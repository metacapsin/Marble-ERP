import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLeaveRoutingModule } from './add-leave-routing.module';
import { AddLeaveComponent } from './add-leave.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { Dropdown, DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    AddLeaveComponent
  ],
  imports: [
    CommonModule,
    AddLeaveRoutingModule,
    SharedModule,
    CalendarModule,
    DropdownModule
  ]
})
export class AddLeaveModule { }
