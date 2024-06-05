import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentOutReportComponent } from './payment-out-reports.component';

const routes: Routes = [{ path: '', component: PaymentOutReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentOutReportsRoutingModule{ }
