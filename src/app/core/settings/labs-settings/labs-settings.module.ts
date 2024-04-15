import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabListsComponent } from './lab-lists/lab-lists.component';
import { LabListsRoutingModule } from './labs-settings-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [],
  imports: [
    LabListsComponent,
    LabListsRoutingModule,
  ]
})
export class LabsSettingsModule { }
