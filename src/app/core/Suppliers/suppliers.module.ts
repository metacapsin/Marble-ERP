import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DialogModule } from 'primeng/dialog';
import { SuppliersComponent } from './suppliers.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [
    SuppliersComponent
  ],
  imports: [
    SuppliersRoutingModule,
    CommonModule,
    SharedModule,
    PanelMenuModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    ToastModule
  ]
})
export class SuppliersModule { }