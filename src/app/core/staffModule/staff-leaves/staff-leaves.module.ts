import { NgModule } from '@angular/core';
import { staffLeavesRoutingModule } from './staff-leaves-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    staffLeavesRoutingModule
  ]
})
export class StaffLeavesModule { }
