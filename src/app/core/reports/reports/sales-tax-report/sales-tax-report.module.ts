import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesTaxReportsRoutingModule } from './sales-tax-report-routing.module';
import { SalesTaxReportsComponent } from './sales-tax-report.component';


@NgModule({
  declarations: [
    SalesTaxReportsComponent
  ],
  imports: [
    SalesTaxReportsRoutingModule,
    SharedModule,
  ]
})
export class SalesTaxReportsModule { }
