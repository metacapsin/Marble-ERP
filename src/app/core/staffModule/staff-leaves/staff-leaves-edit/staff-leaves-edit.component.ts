import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { staffLeavesService } from "../staff-leaves.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { staffService } from "../../staff/staff-service.service";
import * as moment from "moment";
import { SelectButtonChangeEvent } from "primeng/selectbutton";

@Component({
  selector: "app-staff-leaves-edit",
  templateUrl: "./staff-leaves-edit.component.html",
  styleUrl: "./staff-leaves-edit.component.scss",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
})
export class StaffLeavesEditComponent {
  public routes = routes;
  public selectedValue!: string;
  editLeaveForm!: FormGroup;
  leaveId: any;
  leaveDataById = [];
  employeeList = [];
  LeaveData = [
    { value: "Medical Leave" },
    { value: "Casual Leave" },
    { value: "Loss of Pay" },
    { value: "Other Reason" },
  ];
  leaveDuration = [{ value: "Half Day" }, { value: "Full Day" }];
  stateOptions: any[] = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];
  employeeName = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  leaveReasonRegex = /^.{3,48}$/s;
  reasonSet: any;
  constructor(
    private fb: FormBuilder,
    private Service: staffLeavesService,
    private staffService: staffService,
    private MessageService: MessageService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.editLeaveForm = this.fb.group({
      employee: ["", [Validators.required]],
      leaveDuration: ["", [Validators.required]],
      noOfDay: [
        ,
        [Validators.required, Validators.min(0.5), Validators.max(30)],
      ],
      leaveType: ["", Validators.required],
      from: ["", Validators.required],
      to: ["", Validators.required],
      // halfDay: [""],
      leaveReason: [""],

    });
    this.leaveId = this.activeRoute.snapshot.params["id"];
    // Subscribe to changes in the Leave Type field
    this.editLeaveForm.get("leaveType").valueChanges.subscribe(() => {
      this.leaveTypeChange();
    });
    this.editLeaveForm.get("from").valueChanges.subscribe(() => {
      this.calculateNumberOfDays();
    });

    this.editLeaveForm.get("to").valueChanges.subscribe(() => {
      this.calculateNumberOfDays();
    });

    // **Subscribe to changes in the halfDay field**
    // this.editLeaveForm.get("halfDay").valueChanges.subscribe(() => {
    //   this.onhalfDayChange(this.editLeaveForm.get("halfDay").value);
    // });
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

    this.Service.getLeaveDataById(this.leaveId).subscribe((resp: any) => {
      this.leaveDataById = resp;
      console.log("resp dta", resp);
      this.patchForm(resp);
    });
  }
  patchForm(data): void {
    console.log("Patching form with data:", data);
    const noOfDayValue = Number(data.noOfDay); // Ensure it's a number
    console.log("Parsed noOfDayValue:", noOfDayValue);
    this.editLeaveForm.patchValue({
      employee: data.employee,
      noOfDay: noOfDayValue,
      leaveType: data.leaveType,
      from: data.from,
      to: data.to,
      leaveReason: data.leaveReason,
      // halfDay: data.halfDay,
      leaveDuration: data.leaveDuration,
    });
    this.calculateNumberOfDays()
    // console.log(
    //   "halfDay value after patching:",
    //   this.editLeaveForm.get("halfDay")?.value
    // );
  }
  calculateNumberOfDays(): void {
    const fromDate = this.editLeaveForm.get("from").value;
    const toDate = this.editLeaveForm.get("to").value;
    const leaveDuration = this.editLeaveForm.get("leaveDuration").value;

    if (fromDate && toDate) {
      const from = moment(fromDate, "MM/DD/YYYY");
      const to = moment(toDate, "MM/DD/YYYY");
      // Calculate the total number of days between fromDate and toDate, including both
      let days = to.diff(from, "days") + 1; // Including the start date

      // If it's the same day, set days to 0.5 if halfDay is selected
      if (days === 1) {
        days = leaveDuration === "Half Day" ? 0.5 : 1;
      } else {
        // Add 0.5 if leaveDuration is 'Half Day'
        if (leaveDuration === "Half Day") {
          days *= 0.5;
        }
      }
      this.editLeaveForm.get("noOfDay").setValue(days > 0 ? days : 0);
    }
  }


  leaveTypeChange() {
    this.reasonSet = this.editLeaveForm.get("leaveType").value;
    console.log(this.reasonSet);
    const leaveType = this.editLeaveForm.get("leaveType").value;
    const leaveReasonControl = this.editLeaveForm.get("leaveReason");

    if (leaveType === "Other Reason") {
      leaveReasonControl.setValidators([
        Validators.required,
        Validators.pattern(/^.{3,48}$/s),
      ]);
    } else {
      leaveReasonControl.clearValidators();
    }

    leaveReasonControl.updateValueAndValidity();
  }

  leaveDurationChange() {
    // Clear the 'from' and 'to' date fields when Leave Duration changes to 'Half Day' or 'Full Day'
    const leaveDuration = this.editLeaveForm.get("leaveDuration").value;

    if (leaveDuration === "Half Day" || leaveDuration === "Full Day") {
      // Clear the 'from' and 'to' fields
      this.editLeaveForm.get("from").setValue("");
      this.editLeaveForm.get("to").setValue("");

      // Recalculate the number of days since 'from' and 'to' are cleared
      this.editLeaveForm.get("noOfDay").setValue("");
    }
  }
  editLeaveFormSubmit() {
    const formData = this.editLeaveForm.value;
    console.log(this.editLeaveForm.value);
    const noOfDayControl = this.editLeaveForm.get("noOfDay");
    console.log("NoOfDay control state:", noOfDayControl?.value);
    console.log("Errors:", noOfDayControl?.errors);
    const payload = {
      employee: formData.employee,
      from: formData.from,
      leaveType: formData.leaveType,
      to: formData.to,
      noOfDay: formData.noOfDay,
      leaveReason: formData.leaveReason,
      id: "",
      // halfDay: formData.halfDay,
      leaveDuration: formData.leaveDuration,

    };
    console.log("valid form");
    console.log(payload);
    if (this.editLeaveForm.valid) {
      payload.id = this.leaveId;
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
      });
    }
  }
}
