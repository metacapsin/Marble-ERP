import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewPurchaseComponent } from './add-new-purchase/add-new-purchase.component';
import { ListNewPurchaseComponent } from './list-new-purchase/list-new-purchase.component';
import { EditNewPurchaseComponent } from './edit-new-purchase/edit-new-purchase.component';
// import { PurchaseComponent } from './purchase.component';
// import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
// import { EditPurchaseComponent } from './edit-purchase/edit-purchase.component';
// import { PaidPurchaseComponent } from './paid-purchase/paid-purchase.component';
// import { UnpaidPurchaseComponent } from './unpaid-purchase/unpaid-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: ListNewPurchaseComponent,
  },
  {
    path: 'add-new-purchase',
    component: AddNewPurchaseComponent,
  },
  {
    path: 'edit-new-purchase/:id',
    component: EditNewPurchaseComponent,
  },
  // {
  //   path: 'add-purchase',
  //   component: AddPurchaseComponent,
  // },
  // {
  //   path: 'paid-purchase',
  //   component: PaidPurchaseComponent ,
  // },
  // {
  //   path: 'unpaid-purchases',
  //   component: UnpaidPurchaseComponent,
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewPurchaseRoutingModule { }
