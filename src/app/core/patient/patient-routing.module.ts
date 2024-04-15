import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';

const routes: Routes = [
  {
    path: '', component: PatientComponent,
    children: [
      {
        path: 'patients-list',
        loadChildren: () =>
          import('./patients-list/patients-list.module').then(
            (m) => m.PatientsListModule
          ),
      },
      {
        path: 'add-patient',
        loadChildren: () =>
          import('./add-patient/add-patient.module').then(
            (m) => m.AddPatientModule
          ),
      },
      {
        path: 'facesheet/:id',
        loadChildren: () =>
          import('./patient-data/patient-data.module').then(
            (m) => m.PatientDataModule
          ),
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule { }
