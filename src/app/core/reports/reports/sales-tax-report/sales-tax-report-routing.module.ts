import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesTaxReportsComponent } from './sales-tax-report.component';

const routes: Routes = [{ path: '', component: SalesTaxReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesTaxReportsRoutingModule { }
