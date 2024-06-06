import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { staffLeavesService } from "../staff-leaves.service";
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { staffService } from "../../staff/staff-service.service";

@Component({
  selector: 'app-staff-leaves-add',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    ToastModule],
  templateUrl: './staff-leaves-add.component.html',
  styleUrl: './staff-leaves-add.component.scss',
  providers: [MessageService]
})
export class StaffLeavesAddComponent {
  public routes = routes;
  public selectedValue!: string;
  addLeaveForm!: FormGroup;
  employeeList = []
  maxDate = new Date();
  LeaveData = [
    { value: "Medical Leave" },
    { value: "Casual Leave" },
    { value: "Loss of Pay" },
  ];

  constructor(
    private fb: FormBuilder,
    private service: staffLeavesService,
    private staffService: staffService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.addLeaveForm = this.fb.group({
      employee: [
        "",
        [Validators.required],
      ],
      noOfDay: [
        "",
        [Validators.required, Validators.min(1), Validators.max(30)],
      ],
      leaveType: ["", Validators.required],
      from: ["", Validators.required],
      to: ["", Validators.required],
      leaveReason: [
        "",
        [Validators.required, Validators.min(3), Validators.max(50)],
      ],
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
  }

  addLeaveFormSubmit() {
    const formData = this.addLeaveForm.value;

    const paylode = {
      employee: formData.employee,
      from: formData.from,
      leaveType: formData.leaveType,
      to: formData.to,
      noOfDay: formData.noOfDay,
      leaveReason: formData.leaveReason,
    };
    if (this.addLeaveForm.valid) {
      console.log("Form is valid", this.addLeaveForm.value);
      this.service.addLeaveData(paylode).subscribe((resp: any) => {
        console.log(resp);

        if (resp) {
          if (resp.status === "success") {
            const message = "leave request has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/staff-leaves"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("Form is inValid!");
    }
  }
}

