import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { staffService } from '../staff.service';
import { MessageService } from 'primeng/api';
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
  leaveId : any;
  leaveDataById = [];
  LeaveData: data[] = [
  {value: 'Select Leave Type'},
  {value: 'Medical Leave'},
  {value: 'Casual Leave'},
  {value: 'Loss of Pay'},
];
employeeName = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  leaveReason = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  constructor(private fb: FormBuilder,
  private Service: staffService,
  private MessageService: MessageService,
  private activeRoute: ActivatedRoute,
  private router: Router,
  ){
    this.editLeaveForm = this.fb.group({
      employee: ['', [Validators.required, Validators.min(3), Validators.max(50)]],
      noOfDay: ['', [Validators.required, Validators.min(1) , Validators.max(30)]],
      leaveType: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      leaveReason: ['', [Validators.required, Validators.min(3), Validators.max(50)]]
  })
    this.leaveId = this.activeRoute.snapshot.params["id"];

  }
  ngOnInit(): void {
    this.Service.getLeaveDataById(this.leaveId).subscribe((resp: any) => {
      this.leaveDataById = resp;
      console.log("resp dta", resp);
      this.patchForm(resp);
    })}
  patchForm(data) {
    this.editLeaveForm.patchValue({
      employee: data.employee,
      noOfDay: data.noOfDay,
      leaveType: data.leaveType,
      from: data.from,
      to: data.to,
      leaveReason: data.leaveReason      
    });
  }

editLeaveFormSubmit(){
   const formData = this.editLeaveForm.value;
  console.log(this.editLeaveForm.value);
  const payload = {
    employee: formData.employee,
    from: formData.from,
    leaveType: formData.leaveType,
    to: formData.to,
    noOfDay: formData.noOfDay,
    leaveReason: formData.leaveReason,
    id: ""
  };
  console.log("valid form");
  console.log(payload);
  if(this.editLeaveForm.valid){
    payload.id = this.leaveId
  this.Service.updateLeaveData(payload).subscribe((resp: any) => {
    if (resp) {
      if (resp.status === "success") {
        const message = "Leave Request has been updated";
        this.MessageService.add({ severity: "success", detail: message });
        setTimeout(() => {
          this.router.navigate(["/staff/staff-leave"]);
        }, 400);
      } else {
        const message = resp.message;
        this.MessageService.add({ severity: "error", detail: message });
      }
    }
  })
}
}

}
