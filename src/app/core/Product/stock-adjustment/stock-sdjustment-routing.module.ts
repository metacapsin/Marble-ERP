import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockAdjustmentListComponent } from './stock-adjustment-list/stock-adjustment-list.component';



const routes: Routes = [
  { path: '', component: StockAdjustmentListComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockAdjustmentRoutingModule { }
