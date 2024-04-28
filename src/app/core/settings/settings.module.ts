import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabViewModule } from 'primeng/tabview';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { UnitsModule } from './units/units.module';


@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    PanelMenuModule,
    TabViewModule,
    UnitsModule,
    WarehouseListComponent
  ]
})
export class SettingsModule { }