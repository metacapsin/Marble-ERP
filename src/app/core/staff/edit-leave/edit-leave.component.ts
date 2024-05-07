import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

constructor(private fb: FormBuilder){
  this.editLeaveForm = this.fb.group({
    leaveType: [''],
    employeeName: [''],
    numberOfDays: [''],
    fromDate: [''],
    toDate: [''],
    leaveReason: ['']
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
