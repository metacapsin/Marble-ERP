import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersComponent } from './suppliers.component';
import { AddSuppliersComponent } from './add-suppliers/add-suppliers.component';
import { EditSuppliersComponent } from './edit-suppliers/edit-suppliers.component';
import { ViewSuppliersComponent } from './view-suppliers/view-suppliers.component';

const routes: Routes = [
  { path: '',
  component: SuppliersComponent,},
  {path: 'add-suppliers',
  component: AddSuppliersComponent,},
  {path: 'edit-suppliers',
  component: EditSuppliersComponent,},
  {path: 'view-suppliers',
  component: ViewSuppliersComponent,},
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuppliersRoutingModule { }
