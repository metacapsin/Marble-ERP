import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/gaurd/auth.guard';
import { CoreComponent } from './core.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
     
      {
        path: 'departments',
        loadChildren: () =>
          import('./departments/departments.module').then(
            (m) => m.DepartmentsModule
          ),
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./accounts/accounts.module').then((m) => m.AccountsModule),
      },
      {
        path: 'payroll',
        loadChildren: () =>
          import('./payroll/payroll.module').then((m) => m.PayrollModule),
      },
      
      
      
      {
        path: 'assets',
        loadChildren: () =>
          import('./assets/assets.module').then((m) => m.AssetsModule),
      },
      
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('./invoice/invoice.module').then((m) => m.InvoiceModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      
      {
        path: 'customers',
        loadChildren: () =>
          import('./Customers/customers.module').then((m) => m.CustomersModule),
      },

      {
        path: 'suppliers',
        loadChildren: () =>
          import('./Suppliers/suppliers.module').then((m) => m.SuppliersModule),
      },


      { 
        path: 'tables',
        loadChildren: () =>
          import('./tables/tables.module').then((m) => m.TablesModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'gallery',
        loadChildren: () =>
          import('./gallery/gallery.module').then((m) => m.GalleryModule),
      },
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('./edit-profile/edit-profile.module').then(
            (m) => m.EditProfileModule
          ),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./sales/sales.module').then(
            (m) => m.SalesModule
          ),
      },
      {
        path: 'payment-in',
        loadChildren: () =>
          import('./payment-in/payment-in.module').then(
            (m) => m.PaymentInModule
          ),
      },
      {
        path: 'sales-return',
        loadChildren: () =>
          import('./sales-return/sales-return.module').then(
            (m) => m.SalesReturnModule
          ),
      },
      {
        path: 'purchase',
        loadChildren: () =>
          import('./purchase/purchase.module').then(
            (m) => m.PurchaseModule
          ),
      },
      {
        path: 'purchase-return',
        loadChildren: () =>
          import('./purchase-return/purchase-return.module').then(
            (m) => m.PurchaseReturnModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
