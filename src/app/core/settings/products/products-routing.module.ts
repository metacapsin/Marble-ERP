import { NgModule } from '@angular/core';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsAddComponent } from './products-add/products-add.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'add', component: ProductsAddComponent },
  { path: 'edit/:id', component: ProductsEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }
