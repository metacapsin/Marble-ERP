import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesReportsRoutingModule } from './sales-reports-routing.module';
import { SalesReportsComponent } from './sales-reports.component';


@NgModule({
  declarations: [
    SalesReportsComponent
  ],
  imports: [
    CommonModule,
    SalesReportsRoutingModule,
    SharedModule
  ]
})
export class SalesReportsModule { }
