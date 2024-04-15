import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceLocationListComponent } from './service-location-list/service-location-list.component';
import { ServiceLocationAddComponent } from './service-location-add/service-location-add.component';
import { ServiceLocationEditComponent } from './service-location-edit/service-location-edit.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ServiceLocationListComponent },
  { path: 'add', component: ServiceLocationAddComponent },
  { path: 'edit/:id', component: ServiceLocationEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ServiceLocationRoutingModule {}
