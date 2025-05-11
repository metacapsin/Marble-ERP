import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSlabsComponent } from './list-slabs/list-slabs.component';
import { AddSlabsComponent } from './add-slabs/add-slabs.component';
import { EditSlabsComponent } from './edit-slabs/edit-slabs.component';
import { AddSlabComponent } from '../../new-purchase/add-slab/add-slab.component';



const routes: Routes = [
  { path: '', component: ListSlabsComponent },
  // { path: 'slab-add', component: AddSlabsComponent },
  { path: 'slab-add', component: AddSlabComponent },
  { path: 'slab-edit/:id', component: EditSlabsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlabsRoutingModule { }
