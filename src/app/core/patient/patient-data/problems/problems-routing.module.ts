import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProblemsListComponent } from './problems-list/problems-list.component';

const routes: Routes = [{ path: '', component: ProblemsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProblemsListRoutingModule { 
  
}