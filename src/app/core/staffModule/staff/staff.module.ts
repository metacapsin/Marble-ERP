import { NgModule } from '@angular/core';
import { staffRoutingModule } from './staff-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    staffRoutingModule
  ]
})
export class StaffModule { }
