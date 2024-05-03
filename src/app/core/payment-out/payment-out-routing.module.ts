import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentOutListComponent } from './payment-out-list/payment-out-list.component';
import { PaymentOutAddComponent } from './payment-out-add/payment-out-add.component';


const routes: Routes = [
  {
    path: '',
    component: PaymentOutListComponent,
  },
  {
    path: 'add-payment-out',
    component: PaymentOutAddComponent,
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
export class PaymentOutRoutingModule { }
