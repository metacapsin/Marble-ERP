import { NgModule } from '@angular/core';
import { GeneralPartiesRoutingModule } from './general-parties-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralPartiesComponent } from './general-parties.component';
import { AddGeneralPartiesComponent } from './add-general-parties/add-general-parties.component';
import { EditGeneralPartiesComponent } from './edit-general-parties/edit-general-parties.component';
import { ViewGeneralPartiesComponent } from './view-general-parties/view-general-parties.component';

@NgModule({
  declarations: [
    GeneralPartiesComponent,
    AddGeneralPartiesComponent,
    EditGeneralPartiesComponent
  ],
  imports: [
    GeneralPartiesRoutingModule,
    SharedModule,
    ViewGeneralPartiesComponent
  ]
})
export class GeneralPartiesModule { } 