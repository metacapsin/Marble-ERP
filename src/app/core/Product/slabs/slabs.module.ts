import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlabsRoutingModule } from './slabs-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SlabsRoutingModule,
    SharedModule,
    SelectButtonModule
  ],
  providers: [],
})
export class SlabsModule { }
