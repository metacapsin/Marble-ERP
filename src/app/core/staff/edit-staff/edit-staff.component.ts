import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  public selectedValue !: string  ;
deleteIconFunc(){
  this.deleteIcon = !this.deleteIcon
}
department = [
  {value: 'Select  Department'},
  {value: 'Orthopedics'},
  {value: 'Radiology'},
  {value: 'Dentist'},
];
City = [
  {value: 'Select City'},
  {value: 'Alaska'},
  {value: 'Los Angeles'},
];
Country = [
  {value: 'Select Country'},
  {value: 'Usa'},
  {value: 'Uk'},
  {value: 'Italy'},
];
State = [
  {value: 'Select State'},
  {value: 'Rajasthan'},
  {value: 'Up'},
];

constructor(private fb: FormBuilder){
  this.editStaffForm = this.fb.group({
    department: [''],
    firstName: [''],
    lastName: [''],
    birthday: [''],
    mobile: [''],
    email: [''],
    education: [''],
    pincode: [''],
    designation: [''],
    city: [''],
    country: [''],
    state: [''],
    address: [''],
    biography: [''],
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
