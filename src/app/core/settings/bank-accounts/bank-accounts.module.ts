import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BankAccountsComponent } from './bank-accounts.component';
import { BankAccountDialogComponent } from './bank-account-dialog/bank-account-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/core/filter.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { ShowHideDirective } from 'src/app/common-component/show-hide-directive/show-hide.directive';

@NgModule({
  declarations: [
    BankAccountsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BankAccountsComponent
      }
    ]),
    SharedModule,
    MatDialogModule,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    ButtonModule,
    FormsModule,
    TooltipModule,
    FilterPipe,
    ShowHideDirective,
    BankAccountDialogComponent
  ],
  exports: [RouterModule]
})
export class BankAccountsModule { } 