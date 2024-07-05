import { NgModule } from '@angular/core';
import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SuppliersComponent } from './suppliers.component';



@NgModule({
  declarations: [
    SuppliersComponent
  ],
  imports: [
    SuppliersRoutingModule,
    SharedModule,
  ]
})
export class SuppliersModule { }