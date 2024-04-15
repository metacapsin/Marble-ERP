import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { ProvidersProfileViewComponent } from './providers-profile-view/providers-profile-view.component';
import { ProvidersProfileEditComponent } from './providers-profile-edit/providers-profile-edit.component';

const routes: Routes = [
  { path: '', component: ProvidersListComponent },
  { path: 'view/:id', component: ProvidersProfileViewComponent },
  { path: 'edit/:id', component: ProvidersProfileEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvidersProfileRoutingModule {}
