import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { PurchaseReportsComponent } from './purchase-reports.component';
import { PurchaseReportsRoutingModule } from './purchase-reports-routing.module';


@NgModule({
  declarations: [
    PurchaseReportsComponent
  ],
  imports: [
    CommonModule,
    PurchaseReportsRoutingModule,
    SharedModule,
    DropdownModule, CalendarModule
  ]
})
export class PurchaseReportsModule { }
