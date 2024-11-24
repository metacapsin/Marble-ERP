import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { staffService } from "../staff.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-leave",
  templateUrl: "./add-leave.component.html",
  styleUrls: ["./add-leave.component.scss"],
})
export class AddLeaveComponent {
  public routes = routes;
  public selectedValue!: string;
  addLeaveForm!: FormGroup;

  LeaveData = [
    { value: "Medical Leave" },
    { value: "Casual Leave" },
    { value: "Loss of Pay" },
  ];

  constructor(
    private fb: FormBuilder,
    private service: staffService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.addLeaveForm = this.fb.group({
      employee: [
        "",
        [Validators.required, Validators.min(3), Validators.max(50)],
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

  addLeaveFormSubmit() {
    const formData = this.addLeaveForm.value;
    console.log(this.addLeaveForm.value);
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
              this.router.navigate(["/staff/staff-leave"]);
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
