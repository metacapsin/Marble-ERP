import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history.component';
import { PastMedicalHistoryEditComponent } from './past-medical-history-edit/past-medical-history-edit.component';
import { PastSurgicalHistoryComponent } from './past-surgical-history/past-surgical-history.component';
import { FamilyHistoryComponent } from './family-history/family-history.component';
import { SocialHistoryComponent } from './social-history/social-history.component';
import { HospitalizationsProceduresComponent } from './hospitalizations-procedures/hospitalizations-procedures.component';
import { LongTermCareFacilityComponent } from './long-term-care-facility/long-term-care-facility.component';
import { HospiceComponent } from './hospice/hospice.component';
import { ImplantableDevicesComponent } from './implantable-devices/implantable-devices.component';

const routes: Routes = [
  { path: '', component: HistoryComponent },
  { path: 'past-Medical-History', component: PastMedicalHistoryEditComponent },
  { path: 'past-Surgical-History', component: PastSurgicalHistoryComponent },
  { path: 'family-History', component: FamilyHistoryComponent },
  { path: 'social-History', component: SocialHistoryComponent },
  { path: 'hospitalizations-Procedures',component: HospitalizationsProceduresComponent},
  { path: 'long-Term-Care-Facility', component: LongTermCareFacilityComponent },
  { path: 'Hospice', component: HospiceComponent },
  { path: 'implantable-Devices', component: ImplantableDevicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryRoutingModule {}
