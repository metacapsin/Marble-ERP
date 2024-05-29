import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffSalaryListComponent } from './staff-salary-list/staff-salary-list.component';
import { StaffSalaryAddComponent } from './staff-salary-add/staff-salary-add.component';
import { StaffSalaryEditComponent } from './staff-salary-edit/staff-salary-edit.component';


const routes: Routes = [
  {
    path: '',
    component: StaffSalaryListComponent,
  },
  {
    path: 'add-staff-salary',
    component: StaffSalaryAddComponent,
  },
  {
    path: 'edit-staff-salary/:id',
    component: StaffSalaryEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class staffSalaryRoutingModule { }
