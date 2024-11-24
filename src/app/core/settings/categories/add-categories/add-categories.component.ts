import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { validationRegex } from "src/app/core/validation";

@Component({
  selector: "app-add-categories",
  templateUrl: "./add-categories.component.html",
  styleUrl: "./add-categories.component.scss",
  standalone: true,
  imports: [SharedModule],
})
export class AddCategoriesComponent {
  addCategoryForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddCategoriesComponent>
  ) {
    this.addCategoryForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(validationRegex.nameREGEX)]],
      description: ["", [Validators.pattern(validationRegex.descriptionRegex)]],
    });
  }
  addCategoryFormSubmit() {
    if (this.addCategoryForm.valid) {
      this.dialogRef.close(this.addCategoryForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
