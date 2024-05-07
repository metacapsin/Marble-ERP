import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-add-salary',
  templateUrl: './add-salary.component.html',
  styleUrls: ['./add-salary.component.scss']
})
export class AddSalaryComponent {
  public routes = routes;
  public selectedValue ! : string ;
  addSalaryForm! : FormGroup;


  staff= [
    {value: 'Select Staff'},
    {value: 'Williams Bruk'},
    {value: 'Galaviz Lalema'},
  ];
  
constructor(private fb: FormBuilder){
  this.addSalaryForm = this.fb.group({
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


addSalaryFormSubmit(){
  if(this.addSalaryForm.valid){
    console.log("Form is valid", this.addSalaryForm.value);
  }else{
    console.log("Form is inValid!");
    
  }
}
}
