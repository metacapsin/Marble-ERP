import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesReportsRoutingModule } from './sales-reports-routing.module';
import { SalesReportsComponent } from './sales-reports.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    SalesReportsComponent
  ],
  imports: [
    CommonModule,
    SalesReportsRoutingModule,
    SharedModule,
    DropdownModule, CalendarModule
  ]
})
export class SalesReportsModule { }
