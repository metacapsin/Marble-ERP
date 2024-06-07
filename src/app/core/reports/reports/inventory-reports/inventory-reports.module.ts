import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryReportsComponent } from './inventory-reports.component';
import { InventoryReportsRoutingModule } from './inventory-reports-routing.module';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    InventoryReportsComponent
  ],
  imports: [
    CommonModule,
    InventoryReportsRoutingModule,
    SharedModule,
    DropdownModule,
    
  ]
})
export class InventoryReportsModule { }
