import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTabsComponent } from './settings-tabs-view/settings-tabs.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SettingsTabsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [SettingsTabsComponent]
})
export class SettingsTabsModule { }
