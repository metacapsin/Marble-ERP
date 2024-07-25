import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { staffLeavesService } from "../staff-leaves.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { Dropdown, DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { staffService } from "../../staff/staff-service.service";
import * as moment from "moment";

@Component({
  selector: "app-staff-leaves-add",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./staff-leaves-add.component.html",
  styleUrl: "./staff-leaves-add.component.scss",
  providers: [MessageService],
})
export class StaffLeavesAddComponent {
  public routes = routes;
  public selectedValue!: string;
  addLeaveForm!: FormGroup;
  employeeList = [];
  LeaveData = [
    { value: "Medical Leave" },
    { value: "Casual Leave" },
    { value: "Loss of Pay" },
    { value: "Other Reason" },
  ];
  stateOptions: any[] = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  leaveReasonRegex = /^.{3,48}$/s;

  constructor(
    private fb: FormBuilder,
    private service: staffLeavesService,
    private staffService: staffService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.addLeaveForm = this.fb.group({
      employee: ["", [Validators.required]],
      noOfDay: [
        "",
        [Validators.required, Validators.min(1), Validators.max(30)],
      ],
      leaveType: ["", Validators.required],
      from: ["", Validators.required],
      to: ["", Validators.required],
      halfday: ["", Validators.required],
      leaveReason: [
        "",
        [Validators.required, Validators.pattern(this.leaveReasonRegex)],
      ],
      value: ['yes'],
    });
    // Subscribe to changes in the date fields to calculate the number of days
    this.addLeaveForm.get("from").valueChanges.subscribe(() => {
      this.calculateNumberOfDays();
    });

    this.addLeaveForm.get("to").valueChanges.subscribe(() => {
      this.calculateNumberOfDays();
    });
  }

  ngOnInit(): void {
    this.staffService.getStaffData().subscribe((resp: any) => {
      this.employeeList = resp.map((e) => ({
        name: `${e.firstName} ${e.lastName}`,
        _id: {
          _id: e._id,
          name: `${e.firstName} ${e.lastName}`,
        },
      }));
      console.log(this.employeeList);
    });
  }

  calculateNumberOfDays(): void {
    const fromDate = this.addLeaveForm.get("from").value;
    const toDate = this.addLeaveForm.get("to").value;

    if (fromDate && toDate) {
      const from = moment(fromDate, "MM/DD/YYYY");
      const to = moment(toDate, "MM/DD/YYYY");
      const days = to.diff(from, "days") + 1; // Including the start date

      this.addLeaveForm.get("noOfDay").setValue(days > 0 ? days : 0);
    }
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
