import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataManagementsComponent } from './data-managements/data-managements.component';

const routes: Routes = [{ path: '', component: DataManagementsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementsRoutingModule { }
