import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PracticeListComponent } from './practice-list/practice-list.component';
import { AddPracticeComponent } from './add-practice/add-practice.component';
import { EditPracticeComponent } from './edit-practice/edit-practice.component';

const routes: Routes = [
  { path: '', component: PracticeListComponent },
  { path: 'add-practice', component: AddPracticeComponent },
  { path: 'edit-practice/:id', component: EditPracticeComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeProfileRoutingModule { }
