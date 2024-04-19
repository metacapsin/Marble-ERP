import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { SubCategoriesService } from '../sub-categories.service';

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
    public service: SubCategoriesService,
    @Inject(MAT_DIALOG_DATA) public _id: any,
  ){
    this.editSubCategoryForm = this.fb.group({ 
      // subCategoriesSlug: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      name: ['',[Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      categoryId: ['', [Validators.required,]],             
      description: [''],
    })
  }

  ngOnInit(): void {

    this.service.getSubCategoriesById(this._id).subscribe((resp: any) => {
      // this.VisitReasonDataById = resp.data;
      this.editSubCategoryForm.patchValue({
        // name: data.name
      })
    });
  }


  editSubCategoryFormSubmit(){
    if (this.editSubCategoryForm.valid) {
      this.dialogRef.close(this.editSubCategoryForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
