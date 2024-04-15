import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule,ToastModule],
  providers: [MessageService]
})
export class AddLabDialogComponent {
  LabForm!: FormGroup;
  LabCategory = [
    { value: "Chemistry A-K" },
    { value: "Chemistry L-Z" },
    { value: "Chemistry L-Z" },
    { value: "Drug Testing" },
    { value: "Endocrinology" },
    { value: "Hematology" },
    { value: "Imaging" },
    { value: "Microbiology" },
    { value: "Pathology" },
    { value: "Serology" },
    { value: "Test Panels" },
    { value: "Therapeutic Drugs A-M" },
    { value: "Therapeutic Drugs N-Z" },
    { value: "Urinalysis" },
    { value: "Virology" },
  ]


  constructor(public dialog: MatDialog,
    private service: SettingsService,
    private dialogRef: MatDialogRef<AddLabDialogComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {
    this.LabForm = this.fb.group({
      labCategory: ['', [Validators.required]],
      labName: ['', [Validators.required,Validators.pattern(new RegExp(/^.{5,50}$/))]],
      labDiscription: ['',[Validators.pattern(new RegExp(/^.{3,500}$/))]],
    })
  }

  get f() {
    return this.LabForm.controls;
  }

  AddLabFormSubmit() {
    if (this.LabForm.valid) {
      this.dialogRef.close(this.LabForm);
    } else {
      console.log("Form is invalid!");
    }
  }
}
