import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  { path: '', component: ReportsComponent,
  children: [
    {
      path: 'inventory-reports',
      loadChildren: () =>
        import('./inventory-reports/inventory-reports.module').then(
          (m) => m.InventoryReportsModule
        ),
    },
    {
      path: 'sales-reports',
      loadChildren: () =>
        import('./sales-reports/sales-reports.module').then(
          (m) => m.SalesReportsModule
        ),
    },
    {
      path: 'purchase-reports',
      loadChildren: () =>
        import('./purchase-reports/purchase-reports.module').then(
          (m) => m.PurchaseReportsModule
        ),
    },
    {
      path: 'expenses-reports',
      loadChildren: () =>
        import('./expenses-reports/expenses-reports.module').then(
          (m) => m.expensesReportsModule
        ),
    },
    {
      path: 'payment-in-reports',
      loadChildren: () =>
        import('./payment-in-reports copy/payment-in-reports.module').then(
          (m) => m.PaymentInReportsModule
        ),
    },
    {
      path: 'payment-out-reports',
      loadChildren: () =>
        import('./payment-out-reports/payment-out-reports.module').then(
          (m) => m.PaymentOutReportsModule
        ),
    },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
