import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditBlocksComponent } from './edit-blocks/edit-blocks.component';
import { AddBlocksComponent } from './add-blocks/add-blocks.component';
import { BlocksListComponent } from './blocks-list/blocks-list.component';


const routes: Routes = [
  {
    path: '',
    component: BlocksListComponent,
  },
  {
    path: 'add-blocks',
    component: AddBlocksComponent,
  },
  {
    path: 'edit-blocks/:id',
    component: EditBlocksComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlocksRoutingModule { }
