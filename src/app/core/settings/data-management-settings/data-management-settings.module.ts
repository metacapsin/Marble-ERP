import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManagementsComponent } from './data-managements/data-managements.component';
import { DataManagementsRoutingModule } from './data-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    DataManagementsComponent
  ],
  imports: [
    CommonModule,
    DataManagementsRoutingModule,
    SharedModule,
    MatButtonModule
  ]
})
export class DataManagementSettingsModule { }
