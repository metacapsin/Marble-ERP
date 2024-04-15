import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllregiesListComponent } from './allregies-list/allregies-list.component';

const routes: Routes = [{ path: '', component: AllregiesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllergiesListRoutingModule { 
  
}