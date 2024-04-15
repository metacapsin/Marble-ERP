import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPatientRoutingModule } from './add-patient-routing.module';
import { AddPatientComponent } from './add-patient.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [
    AddPatientComponent
  ],
  imports: [
    CommonModule,
    AddPatientRoutingModule,
    SharedModule,
    MatCheckboxModule,
    DropdownModule
  ]
})
export class AddPatientModule { }
