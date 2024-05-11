import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-edit-leave',
  templateUrl: './edit-leave.component.html',
  styleUrls: ['./edit-leave.component.scss']
})
export class EditLeaveComponent {
  public routes = routes;
  public selectedValue !: string ;
  editLeaveForm! : FormGroup

  LeaveData: data[] = [
  {value: 'Select Leave Type'},
  {value: 'Medical Leave'},
  {value: 'Casual Leave'},
  {value: 'Loss of Pay'},
];
employeeName = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  leaveReason = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  constructor(private fb: FormBuilder){
    this.editLeaveForm = this.fb.group({
      leaveType: ["", [Validators.required]],
      numberOfDays: ["", [Validators.required,Validators.min(0)]],
      employeeName: ["", Validators.required,[Validators.pattern(this.employeeName)]],
      fromDate: ["", [Validators.required]],
      toDate: ["", [Validators.required]],
      leaveReason: ["", [Validators.required,Validators.pattern(this.leaveReason)]]
    })
  }


editLeaveFormSubmit(){
  if(this.editLeaveForm.valid){
    console.log("Form is valid", this.editLeaveForm.value);
  }else{
    console.log("Form is inValid!");
    
  }
}

}
