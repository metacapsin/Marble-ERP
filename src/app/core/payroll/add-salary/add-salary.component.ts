import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  type= [
    {value: 'Select Type'},
    {value: 'cash'},
    {value: 'online'},
  ];
   NoAlfregex = /^[^\sA-Za-z]+$/;
  
  constructor(private fb: FormBuilder){
    this.addSalaryForm = this.fb.group({
      StaffName: ['', Validators.required],
      netSalary: ['', [Validators.required, Validators.min(1000) , Validators.max(1000000),Validators.pattern(this.NoAlfregex)]],
      basicSalary: ['', [Validators.required, Validators.min(1000) , Validators.max(1000000),Validators.pattern(this.NoAlfregex)]],
      dearnessAllowance: ['', [Validators.required, Validators.min(1000) , Validators.max(100000),Validators.pattern(this.NoAlfregex)]],
      houseRentAllowance: ['', [Validators.required, Validators.min(1000) , Validators.max(100000)]],
      conveyance: ['', [Validators.required, Validators.min(1000) , Validators.max(100000),Validators.pattern(this.NoAlfregex)]],
      employeeStateInsurance: ['', [Validators.required, Validators.min(1000) , Validators.max(1000000),Validators.pattern(this.NoAlfregex)]],
      taxDeductedAtSource: ['', [Validators.required, Validators.min(1000) , Validators.max(100000),Validators.pattern(this.NoAlfregex)]],
      type: ['',Validators.required],
      providentFund: ['', [Validators.required, Validators.min(1000) , Validators.max(100000),Validators.pattern(this.NoAlfregex)]],
      professionalTax: ['', [Validators.required, Validators.min(1000) , Validators.max(100000),Validators.pattern(this.NoAlfregex)]],
      labourWelfare: ['', [Validators.required, Validators.min(1000) , Validators.max(100000),Validators.pattern(this.NoAlfregex)]],
      medicalAllowance: ['', [Validators.required, Validators.min(1000) , Validators.max(1000000),Validators.pattern(this.NoAlfregex)]],
    });
  }


addSalaryFormSubmit(){
  if(this.addSalaryForm.valid){
    console.log("Form is valid", this.addSalaryForm.value);
  }else{
    console.log("Form is inValid!");
    
  }
}
}
