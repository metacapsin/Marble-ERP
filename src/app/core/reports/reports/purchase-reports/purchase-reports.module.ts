import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { PurchaseReportsComponent } from "./purchase-reports.component";
import { PurchaseReportsRoutingModule } from "./purchase-reports-routing.module";
import { FilterPipe } from "src/app/core/filter.pipe";

@NgModule({
  declarations: [PurchaseReportsComponent],
  imports: [PurchaseReportsRoutingModule, SharedModule],
})
export class PurchaseReportsModule {}
