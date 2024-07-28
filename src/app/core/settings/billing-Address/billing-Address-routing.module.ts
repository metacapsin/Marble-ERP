import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBillingAddressComponent } from './add-billing-Address/add-billing-Address.component';
import { EditBillingAddressComponent } from './edit-billing-Address/edit-billing-Address.component';
import { ListBillingAddressComponent } from './list-billing-Address/List-billing-Address.component';

const routes: Routes = [
  { path: '', component: ListBillingAddressComponent },
  { path: 'add-billing-Address', component: AddBillingAddressComponent },
  { path: 'edit-billing-Address/:id', component: EditBillingAddressComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingAddressRoutingModule {}  