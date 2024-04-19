import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesService } from '../categories.service';
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
    public service: CategoriesService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public _id: any,
  ){
    this.editCategoryForm = this.fb.group({       
    name: ['',[Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
    // CategoriesSlug: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
    })
  }

  ngOnInit(): void {

    this.service.getCategoriesById(this._id).subscribe((resp: any) => {
      // this.VisitReasonDataById = resp.data;
      this.editCategoryForm.patchValue({
        // name: data.name
      })
    });
  }

  editCategoryFormSubmit(){
    if (this.editCategoryForm.valid) {
      this.dialogRef.close(this.editCategoryForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
