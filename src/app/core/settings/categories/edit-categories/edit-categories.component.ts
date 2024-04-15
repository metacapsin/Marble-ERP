import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrl: './edit-categories.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule]
})
export class EditCategoriesComponent {
  editCategoryForm!:FormGroup;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditCategoriesComponent>,
  ){
    this.editCategoryForm = this.fb.group({       
    CategoriesName: ['',[Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
    CategoriesSlug: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
    })
  }
  editCategoryFormSubmit(){
    if (this.editCategoryForm.valid) {
      this.dialogRef.close(this.editCategoryForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
