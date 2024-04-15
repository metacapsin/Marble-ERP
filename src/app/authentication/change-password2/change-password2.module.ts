import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePassword2RoutingModule } from './change-password2-routing.module';
import { ChangePassword2Component } from './change-password2.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ChangePassword2Component
  ],
  imports: [
    CommonModule,
    ChangePassword2RoutingModule,
    SharedModule
  ]
})
export class ChangePassword2Module { }
