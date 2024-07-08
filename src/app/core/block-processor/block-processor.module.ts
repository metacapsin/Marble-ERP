import { NgModule } from '@angular/core';
import { BlockProcessorRoutingModule } from './block-customer-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    BlockProcessorRoutingModule
  ]
})
export class BlockProcessorModule { }
