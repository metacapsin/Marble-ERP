import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitReasonAddDialogComponent } from './visit-reason-add-dialog/visit-reason-add-dialog.component';
import { VisitReasonEditDialogComponent } from './visit-reason-edit-dialog/visit-reason-edit-dialog.component';



@NgModule({
  declarations: [
    VisitReasonEditDialogComponent
  ],
  imports: [
    CommonModule,
    VisitReasonAddDialogComponent
  ]
})
export class VisitReasonDialogModule { }
