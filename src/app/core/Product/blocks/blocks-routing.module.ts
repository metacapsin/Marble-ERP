import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBlocksComponent } from './list-blocks/list-blocks.component';
import { AddBlocksComponent } from './add-blocks/add-blocks.component';
import { EditBlocksComponent } from './edit-blocks/edit-blocks.component';


const routes: Routes = [
  { path: '', component: ListBlocksComponent },
  { path: 'add', component: AddBlocksComponent },
  { path: 'edit/:id', component: EditBlocksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlocksRoutingModule { }
