import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubCategoriesListComponent } from './sub-categories-list/sub-categories-list.component';

const routes: Routes = [{ path: '', component: SubCategoriesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class subCategoriesRoutingModule { }