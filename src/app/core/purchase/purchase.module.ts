import { NgModule } from '@angular/core';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    PurchaseRoutingModule
  ]
})
export class PurchaseModule { }
