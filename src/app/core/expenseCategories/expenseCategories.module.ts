import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesCategoriesRoutingModule } from './expenseCategories-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ExpensesCategoriesComponent } from './expenseCategories.component';
import { FilterPipe } from '../filter.pipe';


@NgModule({
  declarations: [
    ExpensesCategoriesComponent,
  ],
  imports: [
    CommonModule,
    ExpensesCategoriesRoutingModule,
    SharedModule,
    PanelMenuModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    FilterPipe,
  ]
})
export class ExpensesCategoriesModule { }