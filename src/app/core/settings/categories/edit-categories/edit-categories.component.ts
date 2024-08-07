import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CategoriesService } from "../categories.service";
@Component({
  selector: "app-edit-categories",
  templateUrl: "./edit-categories.component.html",
  styleUrl: "./edit-categories.component.scss",
  standalone: true,
  imports: [SharedModule],
})
export class EditCategoriesComponent {
  editCategoryForm!: FormGroup;
  categoryDataById = [];

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  descriptionRegex = /^.{3,500}$/s;

  constructor(
    private fb: FormBuilder,
    public service: CategoriesService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public _id: any
  ) {
    this.editCategoryForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      description: ["", [Validators.pattern(this.descriptionRegex)]],
    });
  }

  ngOnInit(): void {
    this.service.getCategoriesById(this._id).subscribe((resp: any) => {
      this.categoryDataById = resp.data;

      this.fillFormValues(this.categoryDataById);
    });
  }

  fillFormValues(data) {
    this.editCategoryForm.patchValue({
      name: data.name,
      description: data.description,
    });
  }

  editCategoryFormSubmit() {
    if (this.editCategoryForm.valid) {
      this.dialogRef.close(this.editCategoryForm.value);
      console.log(this.editCategoryForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
