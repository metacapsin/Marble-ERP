import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceLocationRoutingModule } from './service-location-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceLocationListComponent } from './service-location-list/service-location-list.component';
import { ServiceLocationAddComponent } from './service-location-add/service-location-add.component';
import { ServiceLocationEditComponent } from './service-location-edit/service-location-edit.component';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [],
  imports: [
    ServiceLocationListComponent,
    ServiceLocationAddComponent,
    ServiceLocationEditComponent,
    ServiceLocationRoutingModule,
    CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule
  ]
})
export class ServiceLocationModule { }
