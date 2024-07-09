import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { ProfitLossReportsRoutingModule } from "./profit-loss-reports-routing.module";
import { ProfitLossReportsComponent } from "./profit-loss-reports.component";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";

@NgModule({
  declarations: [ProfitLossReportsComponent],
  imports: [ProfitLossReportsRoutingModule, SharedModule],
})
export class ProfitLossModule {}
