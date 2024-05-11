import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss']
})
export class EditStaffComponent {
  public routes = routes;
  public deleteIcon  = true;
  editStaffForm! : FormGroup

  Designation = [
    {value: 'Select  Designation'},
    {value: 'Orthopedics'},
    {value: 'Radiology'},
    {value: 'Dentist'},
  ];
  personNameRegex = /^(?! )[A-Za-z]{3,15}(?: [A-Za-z]{3,15})?$/;
  AddressRegex = /^(?! )[A-Za-z]{3,100}(?: [A-Za-z]{3,100})?$/;
  phoneRegex = /^[0-9]{10}$/;
  pinRegex = /^\d{6}$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  constructor(private fb: FormBuilder,

  ){
    this.editStaffForm = this.fb.group({
      upi: [''],
      dob: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.pattern(this.personNameRegex)]],
      lastName: ['', [Validators.required, Validators.pattern(this.personNameRegex)]],
      mobile: ['',[Validators.required, Validators.pattern(this.phoneRegex)]],
      email: ['',[Validators.pattern(this.emailRegex)]],
      pincode: ['',[Validators.required, Validators.pattern(this.pinRegex)]],
      designation: ['', [Validators.required]],
      city: ['', Validators.required],
      address: ['',[Validators.pattern(this.AddressRegex)]],
    })
  }

editStaffFormSubmit(){
  if(this.editStaffForm.valid){
    console.log("Form is valid", this.editStaffForm.value);
  }else{
    console.log("Form is inValid!");
    
  }
}


}
