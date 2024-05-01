import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase.component';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
import { EditPurchaseComponent } from './edit-purchase/edit-purchase.component';
import { PaidPurchaseComponent } from './paid-purchase/paid-purchase.component';
import { UnpaidPurchaseComponent } from './unpaid-purchase/unpaid-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseComponent,
  },
  {
    path: 'add-purchase',
    component: AddPurchaseComponent,
  },
  {
    path: 'edit-purchase/:id',
    component: EditPurchaseComponent,
  },
  {
    path: 'paid-purchase',
    component: PaidPurchaseComponent ,
  },
  {
    path: 'unpaid-purchases',
    component: UnpaidPurchaseComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
