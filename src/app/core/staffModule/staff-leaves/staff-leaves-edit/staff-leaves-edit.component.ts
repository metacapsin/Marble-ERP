import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { staffLeavesService } from '../staff-leaves.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { staffService } from '../../staff/staff-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-staff-leaves-edit',
  templateUrl: './staff-leaves-edit.component.html',
  styleUrl: './staff-leaves-edit.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    ToastModule
  ],
  providers:[MessageService]
})
export class StaffLeavesEditComponent {
  public routes = routes;
  public selectedValue !: string ;
  editLeaveForm! : FormGroup
  leaveId : any;
  leaveDataById = [];
  employeeList = [];
  LeaveData = [
    {value: 'Medical Leave'},
    {value: 'Casual Leave'},
    {value: 'Loss of Pay'},
    {value: 'Other Reason'},
];
  employeeName = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  leaveReasonRegex = /^.{3,48}$/s;
  constructor(private fb: FormBuilder,
  private Service: staffLeavesService,
  private staffService: staffService,
  private MessageService: MessageService,
  private activeRoute: ActivatedRoute,
  private router: Router,
  ){
    this.editLeaveForm = this.fb.group({
      employee: ['', [Validators.required,]],
      noOfDay: ['', [Validators.required, Validators.min(1) , Validators.max(30)]],
      leaveType: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      leaveReason: ['', [Validators.required, Validators.pattern(this.leaveReasonRegex)]]
  })
    this.leaveId = this.activeRoute.snapshot.params["id"];
    this.editLeaveForm.get('from').valueChanges.subscribe(() => {
      this.calculateNumberOfDays();
    });

    this.editLeaveForm.get('to').valueChanges.subscribe(() => {
      this.calculateNumberOfDays();
    });

  }
  ngOnInit(): void {
    this.staffService.getStaffData().subscribe((resp:any) => {
      this.employeeList = resp.map(e => ({ 
        name: `${e.firstName} ${e.lastName}`,
        _id: {
          _id: e._id,
          name: `${e.firstName} ${e.lastName}`
        }
      }));
      console.log(this.employeeList);
      
    });


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

  calculateNumberOfDays(): void {
    const fromDate = this.editLeaveForm.get('from').value;
    const toDate = this.editLeaveForm.get('to').value;

    if (fromDate && toDate) {
      const from = moment(fromDate, 'MM/DD/YYYY');
      const to = moment(toDate, 'MM/DD/YYYY');
      const days = to.diff(from, 'days') + 1; // Including the start date

      this.editLeaveForm.get('noOfDay').setValue(days > 0 ? days : 0);
    }
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
          this.router.navigate(["/staff-leaves"]);
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
