import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditBlockCustomerComponent } from './edit-block-customer/edit-block-customer.component';
import { AddBlockCustomerComponent } from './add-block-customer/add-block-customer.component';
import { BlockCustomerListComponent } from './block-customer-list/block-customer-list.component';


const routes: Routes = [
  {
    path: '',
    component: BlockCustomerListComponent,
  },
  {
    path: 'add-block-customer',
    component: AddBlockCustomerComponent,
  },
  {
    path: 'edit-block-customer/:id',
    component: EditBlockCustomerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockCustomerRoutingModule { }
