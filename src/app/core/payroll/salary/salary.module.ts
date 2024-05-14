import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryRoutingModule } from './salary-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';



@NgModule({
  declarations: [
    
  ],
  imports: [CommonModule,SalaryRoutingModule, SharedModule, DropdownModule, CalendarModule, ToastModule, DialogModule,TabViewModule],
  providers: [MessageService],
})

export class SalaryModule { }
