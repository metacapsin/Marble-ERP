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
  imports: [CommonModule, SharedModule, DropdownModule]
})
export class EditTaxesComponent {

  editTaxesForm!:FormGroup;
  // taxesTypes =[
  //   {value:"Single"},
  //   {value:"Multiple"}
  // ]
  taxDataById = []

  taxNameRegex = /^(?:.{1,50})$/;
  taxRateRegex = /^[0-9]+$/;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditTaxesComponent>,
    private service: TaxesService,
    @Inject(MAT_DIALOG_DATA) public _id: any,
  ){
    this.editTaxesForm = this.fb.group({      
      name: ['',[Validators.required,Validators.pattern(this.taxNameRegex)]],
      taxType: ['Single', [Validators.required]],
      taxRate: ['', [Validators.required,Validators.pattern(this.taxRateRegex)]]
      // multipleTax: this.fb.array([]),
    })
  }

  // get multipleTax() {
  //   return this.editTaxesForm.controls['multipleTax'] as FormArray;
  // }
  // deletesalesItemDetails(multipleTaxDetails: number) {
  //   this.multipleTax.removeAt(multipleTaxDetails);
  // }
  // addsalesItemDetailsItem() {
  //   const item = this.fb.group({
  //     name: ['', [Validators.required]],
  //     taxRate: ['', [Validators.required]],
  //     taxType: ['Single', [Validators.required]]
  //   });
  //   this.multipleTax.push(item);
  // }

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
