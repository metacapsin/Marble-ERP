import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './expenses.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { EditExpensesComponent } from './edit-expenses/edit-expenses.component';
import { ViewExpensesComponent } from './view-expenses/view-expenses.component';

const routes: Routes = [
  { path: '',
  component: ExpensesComponent,},
  {path: 'add-expenses',
  component: AddExpensesComponent,},
  {path: 'edit-expenses/:id',
  component: EditExpensesComponent,},
  {path: 'view-expenses/:id',
  component: ViewExpensesComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule { }
