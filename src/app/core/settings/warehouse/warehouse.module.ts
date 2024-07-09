import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { WarehouseAddComponent } from './warehouse-add/warehouse-add.component';
import { WarehouseEditComponent } from './warehouse-edit/warehouse-edit.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';



@NgModule({
  declarations: [],
  imports: [
    WarehouseListComponent,
    WarehouseAddComponent,
    WarehouseEditComponent,
    WarehouseRoutingModule,
    SharedModule,
  ]
})
export class WarehouseModule { }
