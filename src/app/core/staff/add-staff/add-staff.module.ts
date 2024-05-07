import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStaffRoutingModule } from './add-staff-routing.module';
import { AddStaffComponent } from './add-staff.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { calendar } from 'ngx-bootstrap/chronos/moment/calendar';
import { CalendarModule } from 'primeng/calendar';
import { Checkbox } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    AddStaffComponent
  ],
  imports: [
    CommonModule,
    AddStaffRoutingModule,
    SharedModule,
    CalendarModule,
    DropdownModule
    
  ]
})
export class AddStaffModule { }
