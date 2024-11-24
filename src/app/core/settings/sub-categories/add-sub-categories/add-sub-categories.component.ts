import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { DropdownModule } from "primeng/dropdown";
import { CategoriesService } from "../../categories/categories.service";
import { map } from "rxjs";
import { validationRegex } from "src/app/core/validation";

@Component({
  selector: "app-add-sub-categories",
  templateUrl: "./add-sub-categories.component.html",
  styleUrl: "./add-sub-categories.component.scss",
  standalone: true,
  imports: [SharedModule],
})
export class AddSubCategoriesComponent {
  addSubCategoryForm!: FormGroup;

  categoriesListData = [];
  categoriesList = [];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddSubCategoriesComponent>,
    private categoryService: CategoriesService
  ) {
    this.addSubCategoryForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(validationRegex.nameREGEX)]],
      categoryId: ["", [Validators.required]],
      description: ["", [Validators.pattern(validationRegex.descriptionRegex)]],
    });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe((resp: any) => {
      this.categoriesList = resp.data;
      this.categoriesListData = this.categoriesList.map((e) => ({
        name: e.name,
        _id: {
          name: e.name,
          _id: e._id,
        },
      }));
    });
  }
  addSubCategoryFormSubmit() {
    if (this.addSubCategoryForm.valid) {
      this.dialogRef.close(this.addSubCategoryForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
