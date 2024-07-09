import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// import { InvoiceReportsRoutingModule } from './invoice-reports-routing.module';
// import { InvoiceReportsComponent } from './invoice-reports.component';
import { SharedModule } from "src/app/shared/shared.module";
import { PaymentInReportComponent } from "./payment-in-reports.component";
import { PaymentInReportsRoutingModule } from "./payment-in-reports-routing.module";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { FilterPipe } from "src/app/core/filter.pipe";

@NgModule({
  declarations: [PaymentInReportComponent],
  imports: [PaymentInReportsRoutingModule, SharedModule],
})
export class PaymentInReportsModule {}
