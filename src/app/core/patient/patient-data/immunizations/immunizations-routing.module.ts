import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImmunizationsListComponent } from './immunizations-list/immunizations-list.component';
import { AddImmunizationsComponent } from './add-immunizations/add-immunizations.component';

const routes: Routes = [
  { path: '', component: ImmunizationsListComponent },
  { path: 'add-immunization', component: AddImmunizationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImmunizationsListRoutingModule { 
 
  
}