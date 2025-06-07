import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralPartiesComponent } from './general-parties.component';
import { AddGeneralPartiesComponent } from './add-general-parties/add-general-parties.component';
import { EditGeneralPartiesComponent } from './edit-general-parties/edit-general-parties.component';
import { ViewGeneralPartiesComponent } from './view-general-parties/view-general-parties.component';

const routes: Routes = [
  { path: '',
    component: GeneralPartiesComponent,
  },
  { path: 'add-general-parties',
    component: AddGeneralPartiesComponent,
  },
  { path: 'edit-general-parties/:id',
    component: EditGeneralPartiesComponent,
  },
  { path: 'view-general-parties/:id',
    component: ViewGeneralPartiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralPartiesRoutingModule { } 