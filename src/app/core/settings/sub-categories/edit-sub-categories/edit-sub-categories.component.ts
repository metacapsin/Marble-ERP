import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { SubCategoriesService } from '../sub-categories.service';
import { CategoriesService } from '../../categories/categories.service';

@Component({
  selector: 'app-edit-sub-categories',
  templateUrl: './edit-sub-categories.component.html',
  styleUrl: './edit-sub-categories.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule]
})
export class EditSubCategoriesComponent {
  editSubCategoryForm!:FormGroup;
  // Categories = [
  //   {value:"Mobile"},
  //   {value:"Laptops"},
  //   {value:"Computers"},
  // ]
  categoriesListData = []
  subCategoryDataById = [];

nameRegex = /^[a-zA-Z\d\s]{3,50}$/;// alphanumeric regex

  descriptionRegex = /^(?:.{1,500})$/;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditSubCategoriesComponent>,
    public service: SubCategoriesService,
    @Inject(MAT_DIALOG_DATA) public _id: any,
    private categoryService: CategoriesService,
  ){
    this.editSubCategoryForm = this.fb.group({
      name: ['',[Validators.required,Validators.pattern(this.nameRegex)]],
      categoryId: ['', [Validators.required,]],             
      description: ['',[Validators.pattern(this.descriptionRegex)]]
    })
  }

  ngOnInit(): void {
    this.service.getSubCategoriesById(this._id).subscribe((resp: any) => {
      this.subCategoryDataById = resp.data;
      
      this.FillData(this.subCategoryDataById)
    });
    
    this.categoryService.getCategories().subscribe((resp: any) => {
      this.categoriesListData = resp.data;
    });
  }

  FillData(data){
    this.editSubCategoryForm.patchValue({
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
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
