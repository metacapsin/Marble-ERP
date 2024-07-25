import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeepPaymentListComponent } from './employee-payment-list/employee-payment-list.component';
import { EmployeepPaymentAddComponent } from './employee-payment-add/employee-payment-add.component';


const routes: Routes = [
  {
    path: '',
    component: EmployeepPaymentListComponent,
  },
  {
    path: 'add-employee-payment',
    component: EmployeepPaymentAddComponent,
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
export class EmployeepPaymentRoutingModule { }
