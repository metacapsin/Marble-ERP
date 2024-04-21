import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseReturnComponent } from './purchase-return.component';
import { AddPurchaseReturnComponent } from './add-purchase-return/add-purchase-return.component';
import { EditPurchaseReturnComponent } from './edit-purchase-return/edit-purchase-return.component';
import { PaidPurchaseReturnComponent } from './paid-purchase-return/paid-purchase-return.component';
import { UnpaidPurchaseReturnComponent } from './unpaid-purchase-return/unpaid-purchase-return.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseReturnComponent,
  },
  {
    path: 'add-purchase-return',
    component: AddPurchaseReturnComponent,
  },
  {
    path: 'edit-purchase-return/:id',
    component: EditPurchaseReturnComponent,
  },
  {
    path: 'paid-purchase-return',
    component: PaidPurchaseReturnComponent ,
  },
  {
    path: 'unpaid-purchases-return',
    component: UnpaidPurchaseReturnComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseReturnRoutingModule { }
