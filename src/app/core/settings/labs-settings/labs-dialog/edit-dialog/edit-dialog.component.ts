import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule]
})

export class EditLabDialogComponent {
  LabDataById: any;
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
    private dialogRef: MatDialogRef<EditLabDialogComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public _id: any,
  ) {
    // console.log("In cons", this._id);

    this.LabForm = this.fb.group({
      labCategory: ['', [Validators.required]],
      labName: ['', [Validators.required,Validators.pattern(new RegExp(/^.{5,50}$/))]],
      labDiscription: ['',[Validators.pattern(new RegExp(/^.{3,500}$/))]],
    })
  }

  get f() {
    return this.LabForm.controls;
  }

  ngOnInit(): void {
    this.service.getLabById(this._id).subscribe((resp: any) => {
      this.LabDataById = resp.data;
      console.log("Data", this.LabDataById);
      this.getLabFormValues(this.LabDataById)
    });
  }

  getLabFormValues(data: any) {
    this.LabForm.patchValue({
      labCategory: data.labCategory,
      labName: data.labName,
      labDiscription: data.labDiscription
    })

  }


  EditLabFormSubmit() {
    if (this.LabForm.valid) {
      this.dialogRef.close(this.LabForm);
    } else {
      console.log("Form is invalid!");
    }
  }
}
