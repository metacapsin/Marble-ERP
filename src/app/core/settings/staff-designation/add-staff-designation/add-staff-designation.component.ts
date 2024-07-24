import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SharedModule } from "src/app/shared/shared.module";
@Component({
  selector: "app-add-staff-designation",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./add-staff-designation.component.html",
  styleUrl: "./add-staff-designation.component.scss",
})
export class AddStaffDesignationComponent {
  addDesignationForm!: FormGroup;

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  descriptionRegex = /^.{3,500}$/s;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddStaffDesignationComponent>
  ) {
    this.addDesignationForm = this.fb.group({
      designation: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      description: ["", [Validators.pattern(this.descriptionRegex)]],
    });
  }
  addDesignationFormSubmit() {
    const formData=this.addDesignationForm.value
    console.log("Form Data",formData)
    const payload={
      designation:this.addDesignationForm.value.designation,
      description:this.addDesignationForm.value.description
    }
    if (this.addDesignationForm.valid) {
      this.dialogRef.close(this.addDesignationForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
