import { NgModule } from '@angular/core';
import { VitalsListRoutingModule } from './vitals-routing.module';
import { VitalsListComponent } from './vitals-list/vitals-list.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VitalsListRoutingModule,
    VitalsListComponent
  ]
})
export class VitalsModule { }
