import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import {  MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule]
})
export class UserEditDialogComponent {
  constructor(public dialog: MatDialog){

  }
}
