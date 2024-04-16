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
      path: 'invoice-reports',
      loadChildren: () =>
        import('./invoice-reports/invoice-reports.module').then(
          (m) => m.InvoiceReportsModule
        ),
    },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
