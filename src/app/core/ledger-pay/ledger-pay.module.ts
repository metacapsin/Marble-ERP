import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { LedgerPayRoutingModule } from './ledger-pay-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LedgerPayRoutingModule,
    SharedModule
  ]
})
export class LedgerPayModule { } 