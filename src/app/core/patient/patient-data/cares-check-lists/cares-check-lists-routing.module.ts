import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareCheckListComponent } from './care-check-list/care-check-list.component';


const routes: Routes = [{ path: '', component: CareCheckListComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareCheckListRoutingModule { 
  
}