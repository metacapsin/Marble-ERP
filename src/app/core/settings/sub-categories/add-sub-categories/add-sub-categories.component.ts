import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CategoriesService } from '../../categories/categories.service';

@Component({
  selector: 'app-add-sub-categories',
  templateUrl: './add-sub-categories.component.html',
  styleUrl: './add-sub-categories.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule]
})
export class AddSubCategoriesComponent {
  addSubCategoryForm!:FormGroup;
 
  categoriesListData = []

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddSubCategoriesComponent>,
    private categoryService: CategoriesService,
  ){
    this.addSubCategoryForm = this.fb.group({      
      name: ['',[Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      categoryId: ['', [Validators.required,]],             
      description: [''],
    })
  }

  ngOnInit(){
    this.categoryService.getCategories().subscribe((resp: any) => {
      this.categoriesListData = resp.data;
    })
  }
  addSubCategoryFormSubmit(){
    if (this.addSubCategoryForm.valid) {
      this.dialogRef.close(this.addSubCategoryForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
