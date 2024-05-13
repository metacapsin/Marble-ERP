import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditSalaryRoutingModule } from './edit-salary-routing.module';
import { EditSalaryComponent } from './edit-salary.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    EditSalaryComponent
  ],
  imports: [
    CommonModule,
    EditSalaryRoutingModule,
    SharedModule,
    DropdownModule,
    ToastModule
  ]
})
export class EditSalaryModule { }
