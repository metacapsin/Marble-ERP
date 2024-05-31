import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockTransferListComponent } from './stock-transfer-list/stock-transfer-list.component';



const routes: Routes = [
  { path: '', component: StockTransferListComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockTransferRoutingModule { }
