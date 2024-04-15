import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientDataComponent } from './patient-data.component';

const routes: Routes = [
  {
    path: '',
    component: PatientDataComponent,
    children: [

      {
        path: 'vitals',
        loadChildren: () =>
          import('./vitals/vitals.module').then(
            (m) => m.VitalsModule
          ),
      },
      {
        path: 'demographic',
        loadChildren: () =>
          import('./demographic/demographic.module').then(
            (m) => m.DemographicModule
          ),
      },
      {
        path: 'history',
        loadChildren: () =>
          import('./history/history.module').then(
            (m) => m.HistoryModule
          )
      },
      {
        path: 'problems',
        loadChildren: () =>
          import('./problems/problems.module').then(
            (m) => m.ProblemsModule
          ),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then(
            (m) => m.AccountModule
          ),
      },
      {
        path: 'allergies',
        loadChildren: () =>
          import('./allergies/allergies.module').then(
            (m) => m.AllergiesModule
          ),
      },
      {
        path: 'documents',
        loadChildren: () =>
          import('./documents/documents.module').then(
            (m) => m.DocumentsModule
          ),
      },
      {
        path: 'carechecklists',
        loadChildren: () =>
          import('./cares-check-lists/cares-check-lists.module').then(
            (m) => m.CaresCheckListsModule
          ),
      },
      {
        path: 'flowsheets',
        loadChildren: () =>
          import('./flowsheets/flowsheets.module').then(
            (m) => m.FlowsheetsModule
          ),
      },
      {
        path: 'immunizations',
        loadChildren: () =>
          import('./immunizations/immunizations.module').then(
            (m) => m.ImmunizationsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientDatasRoutingModule { }
