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
        path: 'blocks-processing',
        loadChildren: () =>
          import('./processing/blocks/blocks.module').then((m) => m.BlocksModule),
      },
      {
        path: 'block-customer',
        loadChildren: () =>
          import('./processing/block-customer/block-customer.module').then((m) => m.BlockCustomerModule),
      },
      {
        path: 'slabs',
        loadChildren: () =>
          import('./Product/slabs/slabs.module').then((m) => m.SlabsModule),
      },
      {
        path: 'blocks',
        loadChildren: () =>
          import('./Product/blocks/blocks.module').then((m) => m.BlocksModule),
      },
      {
        path: 'lot',
        loadChildren: () =>
          import('./Product/lot/lot.module').then((m) => m.LotModule),
      },
      {
        path: 'stock-adjustment',
        loadChildren: () =>
          import('./Product/stock-adjustment/stock-adjustment.module').then((m) => m.StockAdjustmentModule),
      },
      {
        path: 'stock-transfer',
        loadChildren: () =>
          import('./Product/stock-transfer/stock-transfer.module').then((m) => m.StockTransferModule),
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
        path: 'block-processor',
        loadChildren: () =>
          import('./block-processor/block-processor.module').then((m) => m.BlockProcessorModule),
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
        path: 'quotations',
        loadChildren: () =>
          import('./quotations/quotations.module').then(
            (m) => m.QuotationsModule
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
        path: 'payment-out',
        loadChildren: () =>
          import('./payment-out/payment-out.module').then(
            (m) => m.PaymentOutModule
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
        path: 'new-purchase',
        loadChildren: () =>
          import('./new-purchase/new-purchase.module').then(
            (m) => m.NewPurchaseModule
          ),
      },
      {
        path: 'purchase-return',
        loadChildren: () =>
          import('./purchase-return/purchase-return.module').then(
            (m) => m.PurchaseReturnModule
          ),
      },
      {
        path: 'expenses',
        loadChildren: () =>
          import('./Expenses/expenses.module').then(
            (m) => m.ExpensesModule
          ),
      },
      {
        path: 'expenseCategories',
        loadChildren: () =>
          import('./expenseCategories/expenseCategories.module').then(
            (m) => m.ExpensesCategoriesModule
          ),
      },
      {
        path: 'staff',
        loadChildren: () =>
          import('./staffModule/staff/staff.module').then(
            (m) => m.StaffModule
          ),
      },
      {
        path: 'staff-leaves',
        loadChildren: () =>
          import('./staffModule/staff-leaves/staff-leaves.module').then(
            (m) => m.StaffLeavesModule
          ),
      },
      {
        path: 'staffDesignation',
        loadChildren: () =>
          import('./settings/staff-designation/staff-designation.module').then(
            (m) => m.StaffDesignationModule

          ),
      },
      {
        path: 'staff-salary',
        loadChildren: () =>
          import('./payrollModule/staff-salary/staff-salary.module').then(
            (m) => m.StaffSalaryModule
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
