import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class AddLeaveComponent {
  public routes = routes;
  public selectedValue !: string  ;
  addLeaveForm! : FormGroup

  LeaveData: data[] = [
  {value: 'Select Leave Type'},
  {value: 'Medical Leave'},
  {value: 'Casual Leave'},
  {value: 'Loss of Pay'},
];

constructor(private fb: FormBuilder){
  this.addLeaveForm = this.fb.group({
    employeeName: ['', [Validators.required, Validators.min(3), Validators.max(50)]],
      numberOfDays: ['', [Validators.required, Validators.min(1)]],
      leaveType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      leaveReason: ['', [Validators.required, Validators.min(3), Validators.max(50)]]
  })
}


addLeaveFormSubmit(){
  if(this.addLeaveForm.valid){
    console.log("Form is valid", this.addLeaveForm.value);
  }else{
    console.log("Form is inValid!");
    
  }
}

}
