import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { expensesReportsComponent } from './expenses-reports.component';

const routes: Routes = [{ path: '', component: expensesReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class expensesReportsRoutingModule { }
