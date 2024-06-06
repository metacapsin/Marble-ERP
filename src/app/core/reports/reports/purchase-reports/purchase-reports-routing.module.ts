import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseReportsComponent } from './purchase-reports.component';

const routes: Routes = [{ path: '', component: PurchaseReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseReportsRoutingModule { }
