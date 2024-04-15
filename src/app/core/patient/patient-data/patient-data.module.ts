import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PatientDatasRoutingModule } from './patient-data-routing.module';
import { PatientDataComponent } from './patient-data.component';

@NgModule({
  declarations: [
    PatientDataComponent,
  ],
  imports: [
    CommonModule,
    PatientDatasRoutingModule,
    SharedModule,
    PanelMenuModule
  ]
})
export class PatientDataModule { }
