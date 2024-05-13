import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSalaryRoutingModule } from './add-salary-routing.module';
import { AddSalaryComponent } from './add-salary.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    AddSalaryComponent
  ],
  imports: [
    CommonModule,
    AddSalaryRoutingModule,
    SharedModule,
    DropdownModule,
    ToastModule,
    ReactiveFormsModule
  ],
  providers: [MessageService]
})
export class AddSalaryModule { }
