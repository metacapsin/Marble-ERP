import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VitalsListComponent } from './vitals-list/vitals-list.component';

const routes: Routes = [{ path: '', component: VitalsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VitalsListRoutingModule { 
  
}