import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAppointmentRoutingModule } from './add-appointment-routing.module';
import { AddAppointmentComponent } from './add-appointment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [
    AddAppointmentComponent
  ],
  imports: [
    CommonModule,
    RadioButtonModule,
    AddAppointmentRoutingModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    SharedModule,
    DialogModule,
    ConfirmPopupModule,
    ToastModule
  ],
  providers:[MessageService,ConfirmationService]
})
export class AddAppointmentModule { }
