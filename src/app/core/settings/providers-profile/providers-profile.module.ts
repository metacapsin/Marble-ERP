import { NgModule } from '@angular/core';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { ProvidersProfileViewComponent } from './providers-profile-view/providers-profile-view.component';
import { ProvidersProfileEditComponent } from './providers-profile-edit/providers-profile-edit.component';
import { ProvidersProfileRoutingModule } from './providers-profile-routing.module';

@NgModule({
  declarations: [],
  imports: [
    ProvidersProfileViewComponent,
    ProvidersProfileEditComponent,
    ProvidersListComponent,
    ProvidersProfileRoutingModule
  ]
})
export class ProvidersProfileModule { }