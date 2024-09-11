import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxVendorsReportsComponent } from './tax-vendors-reports.component';



const routes: Routes = [{ path: '', component: TaxVendorsReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxVendorsReportsRoutingModule { }
