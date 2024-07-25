import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { Router } from "@angular/router";
import { StaffSalaryService } from "../staff-salary.service";
import { staffService } from "src/app/core/staffModule/staff/staff-service.service";
import { SharedModule } from "src/app/shared/shared.module";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-staff-salary-add",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./staff-salary-add.component.html",
  styleUrl: "./staff-salary-add.component.scss",
})
export class StaffSalaryAddComponent {
  public routes = routes;
  public selectedValue!: string;
  addSalaryForm!: FormGroup;
  employeeList: [];
  type = [{ value: "cash" }, { value: "online" }];

  descriptionRegex = /^(?!\s)(?:.{1,500})$/;
  TotalSalary: any = 0;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private Service: StaffSalaryService,
    private staffService: staffService
  ) {
    this.addSalaryForm = this.fb.group({
      employee: ["", Validators.required],
      netSalary: [""],
      basicSalary: [
        "",
        [Validators.required, Validators.min(100), Validators.max(1000000)],
      ],
      hra: [
        "",
        [Validators.required, Validators.min(100), Validators.max(100000)],
      ],
      special: [
        "",
        [Validators.required, Validators.min(100), Validators.max(1000000)],
      ],
      lts: [
        "",
        [Validators.required, Validators.min(100), Validators.max(100000)],
      ],
      // tds: [
      //   "",
      //   [Validators.required, Validators.min(100), Validators.max(100000)],
      // ],
      // type: ["", Validators.required],
      // pf: [
      //   "",
      //   [Validators.required, Validators.min(100), Validators.max(100000)],
      // ],
      deductions: ["", [Validators.min(100), Validators.max(100000)]],
      reason: ["", [Validators.pattern(this.descriptionRegex)]],
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
    });
  }
  findNetSalary() {
    const basicSalary = this.addSalaryForm.get("basicSalary").value || 0;
    const special = this.addSalaryForm.get("special").value || 0;
    const hra = this.addSalaryForm.get("hra").value || 0;
    const lts = this.addSalaryForm.get("lts").value || 0;
    const deductions = this.addSalaryForm.get("deductions").value || 0;
    this.TotalSalary = basicSalary  + hra + lts + special;
    const netSalary = this.TotalSalary - deductions;
    this.addSalaryForm.patchValue({
      netSalary: netSalary || 0,
    });
  }

  addSalaryFormSubmit() {
    const payload = {
      employee: this.addSalaryForm.value.employee,
      netSalary: this.addSalaryForm.value.netSalary,
      basicSalary: this.addSalaryForm.value.basicSalary,
      hra: this.addSalaryForm.value.hra,
      esi: this.addSalaryForm.value.esi,
      // tds: this.addSalaryForm.value.tds,
      // type: this.addSalaryForm.value.type,
      // pf: this.addSalaryForm.value.pf,
      deductions: this.addSalaryForm.value.deductions,
      reason: this.addSalaryForm.value.reason,
    };
    if (this.addSalaryForm.value) {
      this.Service.addEmployeeSalaryData(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Salary has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/staff-salary"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
  }
}
