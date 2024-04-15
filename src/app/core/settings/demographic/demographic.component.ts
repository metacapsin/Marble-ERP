import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { DemographicUpcomingAppointmentsComponent } from './demographic-upcoming-appointments/demographic-upcoming-appointments.component';
import { DemographicProfileComponent } from './demographic-profile/demographic-profile.component';
import { DemographicPatientPortalComponent } from './demographic-patient-portal/demographic-patient-portal.component';
import { DemographicPastAppointmentsComponent } from './demographic-past-appointments/demographic-past-appointments.component';
import { DemographicContactsComponent } from './demographic-contacts/demographic-contacts.component';
import { DemographicAdditionalInfoComponent } from './demographic-additional-info/demographic-additional-info.component';

@Component({
  selector: 'app-demographic',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    DemographicUpcomingAppointmentsComponent,
    DemographicProfileComponent,
    DemographicPatientPortalComponent,
    DemographicPastAppointmentsComponent,
    DemographicContactsComponent,
    DemographicAdditionalInfoComponent,
  ],
  templateUrl: './demographic.component.html',
  styleUrl: './demographic.component.scss',
})
export class DemographicComponent {}
