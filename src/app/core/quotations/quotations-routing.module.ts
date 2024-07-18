import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuotationsComponent } from './list-quotations/list-quotations.component';
import { AddQuotationsComponent } from './add-quotations/add-quotations.component';
import { EditQuotationsComponent } from './edit-quotations/edit-quotations.component';


const routes: Routes = [
  {
    path: '',
    component: ListQuotationsComponent,
  },
  {
    path: 'add-quotations',
    component: AddQuotationsComponent,
  },
  {
    path: 'edit-quotations/:id',
    component: EditQuotationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationsRoutingModule { }
