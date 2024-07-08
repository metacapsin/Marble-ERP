import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FilterPipe } from '../filter.pipe';


@NgModule({
  declarations: [
    ExpensesComponent,
  ],
  imports: [
    CustomersRoutingModule,
    SharedModule,
  ]
})
export class ExpensesModule { }