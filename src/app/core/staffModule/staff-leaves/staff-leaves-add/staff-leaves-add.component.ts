import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
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
import { SelectButtonChangeEvent } from "primeng/selectbutton";

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
  leaveDuration = [{ value: "Half Day" }, { value: "Full Day" }];
  stateOptions: any[] = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  leaveReasonRegex = /^.{3,48}$/s;
  reasonSet: any;

  constructor(
    private fb: FormBuilder,
    private service: staffLeavesService,
    private staffService: staffService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.addLeaveForm = this.fb.group(
      {
        employee: ["", [Validators.required]],
        leaveDuration: ["", [Validators.required]],
        noOfDay: [
          "",
          [Validators.required, Validators.min(0.5), Validators.max(30)],
        ],
        leaveType: ["", Validators.required],
        from: ["", Validators.required],
        to: ["", Validators.required],
        // halfDay: ["no"],
        leaveReason: [""],
      },
      {
        validator: this.dateRangeValidator(), // Add the custom validator here
      }
    );
    // Subscribe to changes in the Leave Type field
    this.addLeaveForm.get("leaveType").valueChanges.subscribe(() => {
      this.leaveTypeChange();
    });
    // Subscribe to changes in the date fields to calculate the number of days
    this.addLeaveForm.get("from").valueChanges.subscribe(() => {
      this.calculateNumberOfDays();
    });

    this.addLeaveForm.get("to").valueChanges.subscribe(() => {
      this.calculateNumberOfDays();
    });

    // this.addLeaveForm.get("halfDay").valueChanges.subscribe(value => {
    //   console.log("halfDay value changed:", value);
    //   this.calculateNumberOfDays(); // Update calculation if needed
    // });
  }

  // Custom Validator Function
  dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fromDate = control.get("from")?.value;
      const toDate = control.get("to")?.value;

      if (
        fromDate &&
        toDate &&
        moment(fromDate, "MM/DD/YYYY").isAfter(moment(toDate, "MM/DD/YYYY"))
      ) {
        return { dateRangeInvalid: true }; // Return error if fromDate is after toDate
      }
      return null;
    };
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
    });
  }

  calculateNumberOfDays(): void {
    // if (this.addLeaveForm.hasError("dateRangeInvalid")) {
    //   this.addLeaveForm.get("noOfDay").setValue(0);
    //   return;
    // }
    const fromDate = this.addLeaveForm.get("from").value;
    const toDate = this.addLeaveForm.get("to").value;
    const leaveDuration = this.addLeaveForm.get("leaveDuration").value;

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
      this.addLeaveForm.get("noOfDay").setValue(days > 0 ? days : 0);
    }
  }

  leaveTypeChange() {
    this.reasonSet = this.addLeaveForm.get("leaveType").value;
    console.log(this.reasonSet);
    const leaveType = this.addLeaveForm.get("leaveType").value;
    const leaveReasonControl = this.addLeaveForm.get("leaveReason");

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
    const leaveDuration = this.addLeaveForm.get("leaveDuration").value;

    if (leaveDuration === "Half Day" || leaveDuration === "Full Day") {
      // Clear the 'from' and 'to' fields
      this.addLeaveForm.get("from").setValue("");
      this.addLeaveForm.get("to").setValue("");

      // Recalculate the number of days since 'from' and 'to' are cleared
      this.addLeaveForm.get("noOfDay").setValue("");
    }
  }

  addLeaveFormSubmit() {
    const formData = this.addLeaveForm.value;
    console.log(formData);
    const payload = {
      employee: formData.employee,
      noOfDay: formData.noOfDay,
      leaveType: formData.leaveType,
      from: formData.from,
      to: formData.to,
      leaveReason: formData.leaveReason,
      // halfDay: formData.halfDay,
      leaveDuration: formData.leaveDuration,
    };
    if (this.addLeaveForm.valid) {
      console.log("Form is valid", this.addLeaveForm.value);
      this.service.addLeaveData(payload).subscribe((resp: any) => {
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
