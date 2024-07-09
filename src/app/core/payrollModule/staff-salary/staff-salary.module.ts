import { NgModule } from '@angular/core';
import { staffSalaryRoutingModule } from './staff-salary-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    staffSalaryRoutingModule
  ]
})
export class StaffSalaryModule { }
