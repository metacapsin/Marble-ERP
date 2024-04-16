import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { InvoiceReportsRoutingModule } from './invoice-reports-routing.module';
// import { InvoiceReportsComponent } from './invoice-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryReportsComponent } from './inventory-reports.component';
import { InventoryReportsRoutingModule } from './inventory-reports-routing.module';


@NgModule({
  declarations: [
    InventoryReportsComponent
  ],
  imports: [
    CommonModule,
    InventoryReportsRoutingModule,
    SharedModule
  ]
})
export class InventoryReportsModule { }
