import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLeaveRoutingModule } from './add-leave-routing.module';
import { AddLeaveComponent } from './add-leave.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { staffService } from '../staff.service';


@NgModule({
  declarations: [
    AddLeaveComponent
  ],
  imports: [
    CommonModule,
    AddLeaveRoutingModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    ToastModule

  ],
  providers: [MessageService, staffService]

})
export class AddLeaveModule { }
