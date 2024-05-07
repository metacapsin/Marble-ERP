import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesCategoriesComponent } from './expenseCategories.component';
// import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { EditExpensesComponent } from './edit-expenseCategories/edit-expenses.component';
import { ViewExpensesComponent } from './view-expenseCategories/view-expenses.component';

const routes: Routes = [
  { path: '',
  component: ExpensesCategoriesComponent,},
  // {path: 'add-expenses',
  // component: AddExpensesComponent,},
  {path: 'edit-expensesCategories/:id',
  component: EditExpensesComponent,},
  {path: 'view-expensesCategories/:id',
  component: ViewExpensesComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesCategoriesRoutingModule { }
