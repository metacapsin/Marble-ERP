import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditSalaryRoutingModule } from './edit-salary-routing.module';
import { EditSalaryComponent } from './edit-salary.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    EditSalaryComponent
  ],
  imports: [
    CommonModule,
    EditSalaryRoutingModule,
    SharedModule,
    DropdownModule
  ]
})
export class EditSalaryModule { }
