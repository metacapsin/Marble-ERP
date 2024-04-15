import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemographicRoutingModule } from './demographic-routing.module';
import { DemographicProfileComponent } from './demographic-profile/demographic-profile.component';
import { DemographicAdditionalInfoComponent } from './demographic-additional-info/demographic-additional-info.component';
import { DemographicContactsComponent } from './demographic-contacts/demographic-contacts.component';
import { DemographicUpcomingAppointmentsComponent } from './demographic-upcoming-appointments/demographic-upcoming-appointments.component';
import { DemographicComponent } from './demographic.component';


@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    DemographicRoutingModule,
    DemographicComponent,
    DemographicProfileComponent,
    DemographicAdditionalInfoComponent,
    DemographicContactsComponent,
    DemographicUpcomingAppointmentsComponent
  ]
})
export class DemographicModule { }
