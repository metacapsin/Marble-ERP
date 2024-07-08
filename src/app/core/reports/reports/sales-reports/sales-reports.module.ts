import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesReportsRoutingModule } from './sales-reports-routing.module';
import { SalesReportsComponent } from './sales-reports.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FilterPipe } from 'src/app/core/filter.pipe';


@NgModule({
  declarations: [
    SalesReportsComponent
  ],
  imports: [
    SalesReportsRoutingModule,
    SharedModule,
  ]
})
export class SalesReportsModule { }
