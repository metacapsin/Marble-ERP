import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditBlockProcessorComponent } from './edit-block-processor/edit-block-processor.component';
import { AddBlockProcessorComponent } from './add-block-processor/add-block-processor.component';
import { BlockProcessorListComponent } from './block-processor-list/block-processor-list.component';
import { ViewBlockProcessorComponent } from './view-block-processor/view-block-processor.component';


const routes: Routes = [
  {
    path: '',
    component: BlockProcessorListComponent,
  },
  {
    path: 'add-block-processor',
    component: AddBlockProcessorComponent,
  },
  {
    path: 'edit-block-processor/:id',
    component: EditBlockProcessorComponent,
  },
  {
    path: 'view-block-processor/:id',
    component: ViewBlockProcessorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockProcessorRoutingModule { }
