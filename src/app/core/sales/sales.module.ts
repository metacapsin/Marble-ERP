import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';

@NgModule({
  declarations: [
    SalesComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
    PanelMenuModule
  ]
})
export class SalesModule { }