import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlosheetsListComponent } from './flowsheets-list/flowsheets-list.component';

const routes: Routes = [{ path: '', component: FlosheetsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowsheetsListRoutingModule { 
  
}