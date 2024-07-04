import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesTaxReportsRoutingModule } from './sales-tax-report-routing.module';
import { SalesTaxReportsComponent } from './sales-tax-report.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FilterPipe } from 'src/app/core/filter.pipe';


@NgModule({
  declarations: [
    SalesTaxReportsComponent
  ],
  imports: [
    CommonModule,
    SalesTaxReportsRoutingModule,
    SharedModule,
    DropdownModule, 
    CalendarModule,
    FilterPipe,
  ]
})
export class SalesTaxReportsModule { }
