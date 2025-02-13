import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { TaxesService } from '../taxes.service';
@Component({
  selector: 'app-edit-taxes',
  templateUrl: './edit-taxes.component.html',
  styleUrl: './edit-taxes.component.scss',  
  standalone: true,
  imports: [ SharedModule]
})
export class EditTaxesComponent {

  editTaxesForm!:FormGroup;
  taxDataById = []
  personNameRegex = /^[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;


  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditTaxesComponent>,
    private service: TaxesService,
    @Inject(MAT_DIALOG_DATA) public _id: any,
  ){
    this.editTaxesForm = this.fb.group({      
      name: ['',[Validators.required]],
      taxRate: ['', [Validators.required, Validators.min(1), Validators.max(99)]]
    })
  }

  ngOnInit(): void {

    this.service.getTaxById(this._id).subscribe((resp: any) => {
      this.taxDataById = resp.data;
      
      this.FillData(this.taxDataById)
    });
  }

  FillData(data){
    this.editTaxesForm.patchValue({
      name: data.name,
      taxType: data.taxType,
      taxRate: data.taxRate
    })
  }


  editTaxesFormSubmit(){
    if (this.editTaxesForm.valid) {
      this.dialogRef.close(this.editTaxesForm.value);
      console.log(this.editTaxesForm.value);
      
    } else {
      console.log("Form is invalid!");
    }
  }
}
