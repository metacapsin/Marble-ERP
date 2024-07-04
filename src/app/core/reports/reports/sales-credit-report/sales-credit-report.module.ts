import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { SalesCreditReportsRoutingModule } from "./sales-credit-report-routing.module";
import { SalesCreditReportsComponent } from "./sales-credit-report.component";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { FilterPipe } from "src/app/core/filter.pipe";

@NgModule({
  declarations: [SalesCreditReportsComponent],
  imports: [
    CommonModule,
    SalesCreditReportsRoutingModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    FilterPipe,
  ],
})
export class SalesCreditReportsModule {}