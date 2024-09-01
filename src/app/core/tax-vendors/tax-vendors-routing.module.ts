import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxVendorListComponent } from './tax-vendor-list/tax-vendor-list.component';
import { TaxVendorAddComponent } from './tax-vendor-add/tax-vendor-add.component';
import { TaxVendorEditComponent } from './tax-vendor-edit/tax-vendor-edit.component';
import { ViewTaxVendorsComponent } from './view-tax-vendors/view-tax-vendors.component';
// import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: TaxVendorListComponent,
  },
  {
    path: 'add-tax-vendor',
    component: TaxVendorAddComponent,
  },
  {
    path: 'edit-tax-vendor/:id',
    component: TaxVendorEditComponent,
  },
  {
    path: 'view-tax-vendor/:id',
    component: ViewTaxVendorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class taxVendorsRoutingModule { }
