import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryRoutingModule } from './history-routing.module';
import { SharedModule } from 'primeng/api';
import { PastMedicalHistoryEditComponent } from './past-medical-history-edit/past-medical-history-edit.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    SharedModule,
    PastMedicalHistoryEditComponent
  ]
})
export class HistoryModule { }
