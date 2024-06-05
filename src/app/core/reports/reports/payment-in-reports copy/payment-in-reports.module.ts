import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { InvoiceReportsRoutingModule } from './invoice-reports-routing.module';
// import { InvoiceReportsComponent } from './invoice-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentInReportComponent } from './payment-in-reports.component';
import { PaymentInReportsRoutingModule } from './payment-in-reports-routing.module';


@NgModule({
  declarations: [
    PaymentInReportComponent
  ],
  imports: [
    CommonModule,
    PaymentInReportsRoutingModule,
    SharedModule
  ]
})
export class PaymentInReportsModule { }
