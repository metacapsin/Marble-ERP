import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { expensesReportsRoutingModule } from './expenses-reports-routing.module';
import { expensesReportsComponent } from './expenses-reports.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FilterPipe } from 'src/app/core/filter.pipe';


@NgModule({
  declarations: [
    expensesReportsComponent
  ],
  imports: [
    expensesReportsRoutingModule,
    SharedModule,
  ]
})
export class expensesReportsModule { }