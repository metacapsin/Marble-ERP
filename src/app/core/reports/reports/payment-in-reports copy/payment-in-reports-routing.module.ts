import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentInReportComponent } from './payment-in-reports.component';

const routes: Routes = [{ path: '', component: PaymentInReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentInReportsRoutingModule{ }
