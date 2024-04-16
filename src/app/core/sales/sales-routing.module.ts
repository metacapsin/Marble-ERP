import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';


const routes: Routes = [
  { path: '',
  component: SalesComponent,},

  // {
  //   path: '',
  //   component: CustomersComponent,
  //   children: [
  //     // {
  //     //   path: 'providers-profiles',
  //     //   loadChildren: () =>
  //     //     import('./providers-profile/providers-profile.').then(
  //     //       (m) => m.ProvidersProfileModule
  //     //     ),
  //     // },
  //     // {
  //     //   path: 'providers-profiles',
  //     //   loadChildren: () =>
  //     //     import('./providers-profile/providers-profile.module').then(
  //     //       (m) => m.ProvidersProfileModule
  //     //     ),
  //     // },
  //     // {
  //     //   path: 'service-locations',
  //     //   loadChildren: () =>
  //     //     import('./service-location/service-location.module').then(
  //     //       (m) => m.ServiceLocationModule
  //     //     ),
  //     // },
  //     // {
  //     //   path: 'practice-information',
  //     //   loadChildren: () =>
  //     //     import('./practice-information/practice-information.module').then(
  //     //       (m) => m.PracticeInformationModule
  //     //     ),
  //     // },
      
      
  //     // {
  //     //   path: 'visit-reasons',
  //     //   loadChildren: () =>
  //     //     import('./visit-reasons/visit-reasons.module').then(
  //     //       (m) => m.VisitReasonsModule
  //     //     ),
  //     // },
      
  //     // {
  //     //   path: 'change-password',
  //     //   loadChildren: () =>
  //     //     import('./change-password/change-password.module').then(
  //     //       (m) => m.ChangePasswordModule
  //     //     ),
  //     // },
      
  //     // {
  //     //   path: 'users',
  //     //   loadChildren: () =>
  //     //     import('./users/users.module').then(
  //     //       (m) => m.UsersModule
  //     //     ),
  //     // },

  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule { }
