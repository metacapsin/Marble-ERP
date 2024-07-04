import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesCreditReportsComponent } from './sales-credit-report.component';

const routes: Routes = [{ path: '', component: SalesCreditReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesCreditReportsRoutingModule { }
