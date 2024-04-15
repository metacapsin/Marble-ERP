import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-edit-taxes',
  templateUrl: './edit-taxes.component.html',
  styleUrl: './edit-taxes.component.scss',  
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule]
})
export class EditTaxesComponent {

  editTaxesForm!:FormGroup;
  taxesTypes =[
    {value:"Single"},
    {value:"Multiple"}
  ]
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditTaxesComponent>,
  ){
    this.editTaxesForm = this.fb.group({      
      taxesName: ['',[Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      taxesType: ['', [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))]],
      taxesRate: ['', [Validators.required,]]
    })
  }
  editTaxesFormSubmit(){
    if (this.editTaxesForm.valid) {
      this.dialogRef.close(this.editTaxesForm.value);
    } else {
      console.log("Form is invalid!");
    }
  }
}
