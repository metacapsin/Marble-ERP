import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSalesReturnComponent } from './all-sales-return/all-sales-return.component';
import { AddSalesReturnComponent } from './add-sales-return/add-sales-return.component';
import { EditSalesReturnComponent } from './edit-sales-return/edit-sales-return.component';


const routes: Routes = [
  {
    path: '',
    component: AllSalesReturnComponent,
  },
  {
    path: 'add-sales-return',
    component: AddSalesReturnComponent,
  },
  {
    path: 'edit-sales-return/:id',
    component: EditSalesReturnComponent,
  },
  // {
  //   path: 'paid-sales',
  //   component: PaidSalesComponent,
  // },
  // {
  //   path: 'unpaid-sales',
  //   component: UnpaidSalesComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesReturnRoutingModule { }
