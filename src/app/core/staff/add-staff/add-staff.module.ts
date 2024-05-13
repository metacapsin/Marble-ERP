import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStaffRoutingModule } from './add-staff-routing.module';
import { AddStaffComponent } from './add-staff.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { calendar } from 'ngx-bootstrap/chronos/moment/calendar';
import { CalendarModule } from 'primeng/calendar';
import { Checkbox } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { staffService } from '../staff.service';


@NgModule({
  declarations: [
    AddStaffComponent
  ],
  imports: [
    CommonModule,
    AddStaffRoutingModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    ToastModule
    
  ],
  providers: [MessageService, staffService]
})
export class AddStaffModule { }
