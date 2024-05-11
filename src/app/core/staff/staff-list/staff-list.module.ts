import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffListRoutingModule } from './staff-list-routing.module';
import { StaffListComponent } from './staff-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    StaffListComponent
  ],
  imports: [CommonModule, 
  SharedModule, 
  DropdownModule, 
  CalendarModule, ToastModule, DialogModule,TabViewModule,StaffListRoutingModule,
],
providers:[ MessageService]

})
export class StaffListModule { }
