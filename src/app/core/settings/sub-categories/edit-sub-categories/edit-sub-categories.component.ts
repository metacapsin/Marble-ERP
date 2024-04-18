import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-edit-sub-categories',
  templateUrl: './edit-sub-categories.component.html',
  styleUrl: './edit-sub-categories.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule]
})
export class EditSubCategoriesComponent {
  editSubCategoryForm!:FormGroup;
  Categories = [
    {value:"Mobile"},
    {value:"Laptops"},
    {value:"Computers"},
  ]

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditSubCategoriesComponent>,
  ){
    this.editSubCategoryForm = this.fb.group({ 
      subCategoriesName: ['',[Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      subCategoriesSlug: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      subCategoriesCategory: ['', [Validators.required,]]
    })
  }
  editSubCategoryFormSubmit(){
    if (this.editSubCategoryForm.valid) {
      this.dialogRef.close(this.editSubCategoryForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}