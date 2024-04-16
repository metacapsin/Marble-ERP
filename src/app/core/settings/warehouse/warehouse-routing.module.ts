import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { WarehouseAddComponent } from './warehouse-add/warehouse-add.component';
import { WarehouseEditComponent } from './warehouse-edit/warehouse-edit.component';

const routes: Routes = [
  { path: '', component: WarehouseListComponent },
  { path: 'add', component: WarehouseAddComponent },
  { path: 'edit/:id', component: WarehouseEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule { }
