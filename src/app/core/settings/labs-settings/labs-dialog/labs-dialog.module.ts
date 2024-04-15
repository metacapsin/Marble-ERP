import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLabDialogComponent } from './add-dialog/add-dialog.component';
import { EditLabDialogComponent } from './edit-dialog/edit-dialog.component';



@NgModule({
  declarations: [
    AddLabDialogComponent,
    EditLabDialogComponent],
  imports: [
    CommonModule
  ]
})
export class LabsDialogModule { }
