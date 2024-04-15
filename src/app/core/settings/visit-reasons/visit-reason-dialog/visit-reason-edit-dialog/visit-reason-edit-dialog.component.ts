import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChipsModule } from 'primeng/chips';
import { VisitReasonsService } from 'src/app/shared/data/visit-reasons.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-visit-reason-edit-dialog',
  templateUrl: './visit-reason-edit-dialog.component.html',
  styleUrls: ['./visit-reason-edit-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ChipsModule, DropdownModule]
})
export class VisitReasonEditDialogComponent {
  VisitReasonDataById: any;

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
    private dialogRef: MatDialogRef<VisitReasonEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _id: any,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {

    this.form = this.fb.group({
      visitReasonName: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      visitReasonDuration: ['', [Validators.required, Validators.min(1), Validators.max(30)]],
      visitReasonColorInCalender: ['', [Validators.required]],
      visitReasonServices: ['', [Validators.required,Validators.pattern(new RegExp(/^.{3,500}$/))]],
    })

  }

  ngOnInit(): void {

    this.service.getVisitReasonById(this._id).subscribe((resp: any) => {
      this.VisitReasonDataById = resp.data;
      console.log(this.VisitReasonDataById);

      this.getFormValues(this.VisitReasonDataById)
    });
  }

  getFormValues(data: any) {
    this.form.patchValue({
      visitReasonName: data.visitReasonName,
      visitReasonDuration: data.visitReasonDuration,
      visitReasonColorInCalender: data.visitReasonColorInCalender,
      visitReasonServices: data.visitReasonServices
    })

  }


  get f() {
    return this.form.controls;
  }

  VisitReasonFormSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    } else {
      console.log("Form is invalid!");
    }
  }
}
