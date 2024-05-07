import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent {
  public routes = routes;
  addStaffForm! : FormGroup
  public selectedValue !: string  ;

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
    this.addStaffForm = this.fb.group({
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


  addStaffFormSubmit(){
    if(this.addStaffForm.valid){
      console.log("Form is valid", this.addStaffForm.value);
    }else{
      console.log("Form is inValid!");
      
    }
  }
}
