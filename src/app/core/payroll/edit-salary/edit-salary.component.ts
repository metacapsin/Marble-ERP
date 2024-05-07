import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-edit-salary',
  templateUrl: './edit-salary.component.html',
  styleUrls: ['./edit-salary.component.scss']
})
export class EditSalaryComponent {
  public routes = routes;
  public selectedValue !: string  ;
  editSalaryForm! : FormGroup;

  staff= [
    {value: 'Select Staff'},
    {value: 'Williams Bruk'},
    {value: 'Galaviz Lalema'},
  ];

  
constructor(private fb: FormBuilder){
  this.editSalaryForm = this.fb.group({
    StaffName: [''],
    netSalary: [''],
    basicSalary: [''],
    dearnessAllowance: [''],
    houseRentAllowance: [''],
    conveyance: [''],
    employeeStateInsurance: [''],
    taxDeductedAtSource: [''],
    others: [''],
    providentFund: [''],
    professionalTax: [''],
    labourWelfare: [''],
    medicalAllowance: [''],
  })
}


editSalaryFormSubmit(){
  if(this.editSalaryForm.valid){
    console.log("Form is valid", this.editSalaryForm.value);
  }else{
    console.log("Form is inValid!");
    
  }
}
}
