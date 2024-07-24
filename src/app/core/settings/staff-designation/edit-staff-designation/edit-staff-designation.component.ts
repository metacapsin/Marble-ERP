import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SharedModule } from "src/app/shared/shared.module";
import { StaffDesignationService } from "../staff-designation.service";
@Component({
  selector: 'app-edit-staff-designation',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './edit-staff-designation.component.html',
  styleUrl: './edit-staff-designation.component.scss'
})
export class EditStaffDesignationComponent {
  editDesignationForm!: FormGroup;
  staffDesignationDataById = [];


  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  descriptionRegex = /^.{3,500}$/s;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public service: StaffDesignationService,
    private dialogRef: MatDialogRef<EditStaffDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) public _id: any

  ) {
    this.editDesignationForm = this.fb.group({
      designation: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      description: ["", [Validators.pattern(this.descriptionRegex)]],
    });
  }

  ngOnInit(): void {
    this.service.getStaffDesignationById(this._id).subscribe((resp: any) => {
      this.staffDesignationDataById = resp.data;

      this.fillFormValues(this.staffDesignationDataById);
    });
  }
  fillFormValues(data) {
    this.editDesignationForm.patchValue({
      designation: data.designation,
      description: data.description,
    });
  }

  editStaffDesignationFormSubmit() {
    if (this.editDesignationForm.valid) {
      this.dialogRef.close(this.editDesignationForm.value);
      console.log(this.editDesignationForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }

}
