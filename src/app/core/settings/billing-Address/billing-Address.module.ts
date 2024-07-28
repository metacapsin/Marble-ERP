import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillingAddressRoutingModule } from './billing-Address-routing.module';
import { AddBillingAddressComponent } from './add-billing-Address/add-billing-Address.component';
import { EditBillingAddressComponent } from './edit-billing-Address/edit-billing-Address.component';

@NgModule({
  declarations: [
  ],
  imports: [
    BillingAddressRoutingModule,
    SharedModule
  ]
})
export class BillingAddressModule { }