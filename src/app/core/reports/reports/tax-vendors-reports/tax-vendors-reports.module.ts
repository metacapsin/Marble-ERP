import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { TaxVendorsReportsComponent } from "./tax-vendors-reports.component";
import { TaxVendorsReportsRoutingModule } from "./tax-vendors-reports-routing.module";

@NgModule({
  declarations: [TaxVendorsReportsComponent],
  imports: [SharedModule, TaxVendorsReportsRoutingModule],
})
export class TaxVendorsReportsModule {}
