import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// import { InvoiceReportsRoutingModule } from './invoice-reports-routing.module';
// import { InvoiceReportsComponent } from './invoice-reports.component';
import { SharedModule } from "src/app/shared/shared.module";
import { PaymentOutReportComponent } from "./payment-out-reports.component";
import { PaymentOutReportsRoutingModule } from "./payment-out-reports-routing.module";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { FilterPipe } from "src/app/core/filter.pipe";

@NgModule({
  declarations: [PaymentOutReportComponent],
  imports: [PaymentOutReportsRoutingModule, SharedModule],
})
export class PaymentOutReportsModule {}
