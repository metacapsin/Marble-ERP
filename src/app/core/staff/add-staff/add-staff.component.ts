import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
import { staffService } from '../staff.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
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
    private service: staffService,
    private messageService: MessageService,
    private router: Router
  ){
    this.addStaffForm = this.fb.group({
      upiId: [''],
      dateOfBirth: ['', Validators.required],
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


  addStaffFormSubmit(){
    if(this.addStaffForm.valid){
      console.log("Form is valid", this.addStaffForm.value);
      this.service.addStaffData(this.addStaffForm.value).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Staff has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/staff/staff-list"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      })
    }else{
      console.log("Form is inValid!");
      
    }
  }
}
