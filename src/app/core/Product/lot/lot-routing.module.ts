import { NgModule } from '@angular/core';
import { ListLotComponent } from './list-lot/list-lot.component';
import { AddLotComponent } from './add-lot/add-lot.component';
import { EditLotComponent } from './edit-lot/edit-lot.component';
import { RouterModule, Routes } from '@angular/router';





const routes: Routes = [
  { path: '', component: ListLotComponent },
  { path: 'add', component: AddLotComponent },
  { path: 'edit/:id', component: EditLotComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LotRoutingModule { }
