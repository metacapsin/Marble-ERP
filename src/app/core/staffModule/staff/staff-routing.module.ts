import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffAddComponent } from './staff-add/staff-add.component';
import { StaffEditComponent } from './staff-edit/staff-edit.component';
import { StaffListComponent } from './staff-list/staff-list.component';


const routes: Routes = [
  {
    path: '',
    component: StaffListComponent,
  },
  {
    path: 'add-staff',
    component: StaffAddComponent,
  },
  {
    path: 'edit-staff/:id',
    component: StaffEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class staffRoutingModule { }
