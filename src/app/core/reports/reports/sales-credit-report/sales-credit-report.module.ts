import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { SalesCreditReportsRoutingModule } from "./sales-credit-report-routing.module";
import { SalesCreditReportsComponent } from "./sales-credit-report.component";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { FilterPipe } from "src/app/core/filter.pipe";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";

@NgModule({
  declarations: [SalesCreditReportsComponent],
  imports: [SalesCreditReportsRoutingModule, SharedModule, InvoiceDialogComponent],
})
export class SalesCreditReportsModule {}
