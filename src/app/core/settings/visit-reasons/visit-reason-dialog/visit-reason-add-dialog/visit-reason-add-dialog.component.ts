import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChipsModule } from 'primeng/chips';
import { VisitReasonsService } from 'src/app/shared/data/visit-reasons.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-visit-reason-add-dialog',
  templateUrl: './visit-reason-add-dialog.component.html',
  styleUrls: ['./visit-reason-add-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ChipsModule, DropdownModule]
})
export class VisitReasonAddDialogComponent {
  form!: FormGroup;
  codes: string[] | undefined;
  colors = [
    { value: "Red" },
    { value: "Green" },
    { value: "Blue" },
    { value: "Black" },
    { value: "White" },
    { value: "Purple" },
    { value: "Orange" },
    { value: "Gray" },
    { value: "Yellow" },
    { value: "Brown" }
  ];

  constructor(public dialog: MatDialog,
    private service: VisitReasonsService,
    private dialogRef: MatDialogRef<VisitReasonAddDialogComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      visitReasonName: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      visitReasonDuration: ['', [Validators.required, Validators.min(1), Validators.max(30)]],
      visitReasonColorInCalender: ['', [Validators.required]],
      visitReasonServices: ['', [Validators.required,Validators.pattern(new RegExp(/^.{3,500}$/))]],
    })
  }

  get f() {
    return this.form.controls;
  }

  VisitReasonFormSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
