import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffLeavesAddComponent } from './staff-leaves-add/staff-leaves-add.component';
import { StaffLeavesEditComponent } from './staff-leaves-edit/staff-leaves-edit.component';
import { StaffLeavesListComponent } from './staff-leaves-list/staff-leaves-list.component';


const routes: Routes = [
  {
    path: '',
    component: StaffLeavesListComponent,
  },
  {
    path: 'add-staff-leaves',
    component: StaffLeavesAddComponent,
  },
  {
    path: 'edit-staff-leaves/:id',
    component: StaffLeavesEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class staffLeavesRoutingModule { }
