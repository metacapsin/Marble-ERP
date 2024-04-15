import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LabListsComponent } from './lab-lists/lab-lists.component';

const routes: Routes = [{ path: '', component: LabListsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabListsRoutingModule { }
