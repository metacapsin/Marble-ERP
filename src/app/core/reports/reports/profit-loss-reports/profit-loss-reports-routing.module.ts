import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfitLossReportsComponent } from './profit-loss-reports.component';

const routes: Routes = [{ path: '', component: ProfitLossReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfitLossReportsRoutingModule { }
