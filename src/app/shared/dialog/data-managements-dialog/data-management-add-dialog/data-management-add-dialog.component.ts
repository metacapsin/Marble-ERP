import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/shared/data/settings.service';

@Component({
  selector: 'app-data-management-add-dialog',
  templateUrl: './data-management-add-dialog.component.html',
  styleUrl: './data-management-add-dialog.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule]
})
export class DataManagementAddDialogComponent {
  RunExportForm!: FormGroup;

  providers = [
    { value: "Adnan" },
    { value: "Kavya" },
    { value: "Nadim" },
  ];

  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.RunExportForm = this.fb.group({
      bigginingTime: ['']
    })
  }

  RunExportFormSubmit() {

  }
}
