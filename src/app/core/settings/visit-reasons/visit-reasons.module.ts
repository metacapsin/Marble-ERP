import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitReasonListComponent } from './visit-reasons-list/visit-reasons-list.component';
import { VisitReasonsRoutingModule } from './visit-reasons-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
  ],
  imports: [
    VisitReasonListComponent,
    VisitReasonsRoutingModule,
  ]
})
export class VisitReasonsModule { }