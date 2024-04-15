import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrescriptionPreferenceComponent } from './prescription-preference/prescription-preference.component';

const routes: Routes = [{ path: '', component: PrescriptionPreferenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionPreferenceRoutingModule { }
