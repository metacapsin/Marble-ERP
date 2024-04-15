import { NgModule } from '@angular/core';
import { VitalsListRoutingModule } from './account-routing.module';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VitalsListRoutingModule,
    AccountComponent
  ]
})
export class AccountModule { }
