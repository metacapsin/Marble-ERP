import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditLeaveRoutingModule } from './edit-leave-routing.module';
import { EditLeaveComponent } from './edit-leave.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    EditLeaveComponent
  ],
  imports: [
    CommonModule,
    EditLeaveRoutingModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    ToastModule
  ],
  providers:[MessageService]
})
export class EditLeaveModule { }
