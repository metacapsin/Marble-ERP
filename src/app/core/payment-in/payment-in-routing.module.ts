import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentInListComponent } from './payment-in-list/payment-in-list.component';
import { PaymentInAddComponent } from './payment-in-add/payment-in-add.component';


const routes: Routes = [
  {
    path: '',
    component: PaymentInListComponent,
  },
  {
    path: 'add-payment-in',
    component: PaymentInAddComponent,
  },
  // {
  //   path: 'edit-sales/:id',
  //   component: EditSalsComponent,
  // }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentInRoutingModule { }
