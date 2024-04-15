import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { CalenderRoutingModule } from './calender-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RadioButtonModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    DialogModule,
    CalenderRoutingModule
  ],
  providers:[MessageService]
})
export class CalenderModule { }
