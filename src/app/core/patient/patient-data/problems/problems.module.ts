import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemsListRoutingModule } from './problems-routing.module';
import { ProblemsListComponent } from './problems-list/problems-list.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProblemsListComponent,
    ProblemsListRoutingModule
  ]
})
export class ProblemsModule { }
