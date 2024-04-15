import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemographicComponent } from './demographic.component';

const routes: Routes = [
  {path:'',component: DemographicComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemographicRoutingModule { }