import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'providers-profiles',
        loadChildren: () =>
          import('./providers-profile/providers-profile.module').then(
            (m) => m.ProvidersProfileModule
          ),
      },
      {
        path: 'providers-profiles',
        loadChildren: () =>
          import('./providers-profile/providers-profile.module').then(
            (m) => m.ProvidersProfileModule
          ),
      },
      {
        path: 'service-locations',
        loadChildren: () =>
          import('./service-location/service-location.module').then(
            (m) => m.ServiceLocationModule
          ),
      },
      {
        path: 'warehouse',
        loadChildren: () =>
          import('./warehouse/warehouse.module').then(
            (m) => m.WarehouseModule
          ),
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'practice-information',
        loadChildren: () =>
          import('./practice-information/practice-information.module').then(
            (m) => m.PracticeInformationModule
          ),
      },
      
      {
        path: 'visit-reasons',
        loadChildren: () =>
          import('./visit-reasons/visit-reasons.module').then(
            (m) => m.VisitReasonsModule
          ),
      },
      
      {
        path: 'change-password',
        loadChildren: () =>
          import('./change-password/change-password.module').then(
            (m) => m.ChangePasswordModule
          ),
      },
      
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then(
            (m) => m.UsersModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./categories/categories.module').then(
            (m) => m.CategoriesModule

          ),
      },
      {
        path: 'subCategories',
        loadChildren: () =>
          import('./sub-categories/sub-categories.module').then(
            (m) => m.SubCategoriesModule

          ),
      },
      {
        path: 'taxes',
        loadChildren: () =>
          import('./taxes/taxes.module').then(
            (m) => m.TaxesModule

          ),
      },
      {
        path: 'units',
        loadChildren: () =>
          import('./units/units.module').then(
            (m) => m.UnitsModule

          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
