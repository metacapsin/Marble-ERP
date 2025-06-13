import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LedgerPayComponent } from './ledger-pay.component';
import { LedgerPayDashboardComponent } from './ledger-pay-dashboard/ledger-pay-dashboard.component';
import { LedgerPayEntryComponent } from './ledger-pay-entry/ledger-pay-entry.component';
import { LedgerPayHistoryComponent } from './ledger-pay-history/ledger-pay-history.component';

const routes: Routes = [
  {
    path: '',
    component: LedgerPayComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: LedgerPayDashboardComponent },
      { path: 'entry', component: LedgerPayEntryComponent },
      { path: 'history', component: LedgerPayHistoryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LedgerPayRoutingModule { } 