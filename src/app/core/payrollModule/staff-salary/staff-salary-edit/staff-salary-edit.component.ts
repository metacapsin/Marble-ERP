import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { ActivatedRoute, Router } from "@angular/router";
import { StaffSalaryService } from "../staff-salary.service";
import { staffService } from "src/app/core/staffModule/staff/staff-service.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
@Component({
  selector: "app-staff-salary-edit",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./staff-salary-edit.component.html",
  styleUrl: "./staff-salary-edit.component.scss",
  providers: [MessageService],
})
export class StaffSalaryEditComponent {
  public routes = routes;
  public selectedValue!: string;
  editSalaryForm!: FormGroup;
  employeeList: [];
  salaryId: any;
  salaryDataById = [];

  idType = [
    { value: "Aadhaar (India)" },
    { value: "Passport" },
    { value: "Driver's License" },
    { value: "Voter ID (India)" },
    { value: "PAN Card (India)" },
    { value: "Social Security Number (SSN) (USA)" },
    { value: "National ID Card (various countries)" },
    { value: "Resident Permit (various countries)" },
  ];

  descriptionRegex = /^(?!\s)(?:.{1,500})$/;
  TotalSalary: any = 0;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private Service: StaffSalaryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private staffService: staffService
  ) {
    this.editSalaryForm = this.fb.group({
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
      idType: ["", Validators.required],
      reason: ["", [Validators.pattern(this.descriptionRegex)]],
    });
    this.salaryId = this.activeRoute.snapshot.params["id"];
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
    this.Service.getEmployeeSalaryDataById(this.salaryId).subscribe(
      (resp: any) => {
        this.salaryDataById = resp;
        console.log("resp dta", resp);
        this.patchForm(resp);
      }
    );
  }
  findNetSalary() {
    const basicSalary = this.editSalaryForm.get("basicSalary").value || 0;
    const specialPay = this.editSalaryForm.get("specialPay").value || 0;
    const hra = this.editSalaryForm.get("hra").value || 0;
    const lts = this.editSalaryForm.get("lts").value || 0;
    const deductions = this.editSalaryForm.get("deductions").value || 0;
    this.TotalSalary = basicSalary + hra + lts + specialPay;
    const netSalary = this.TotalSalary - deductions;
    this.editSalaryForm.patchValue({
      netSalary: netSalary || 0,
    });
  }
  patchForm(data) {
    this.editSalaryForm.patchValue({
      employee: data.employee,
      netSalary: data.netSalary,
      basicSalary: data.basicSalary,
      hra: data.hra,
      esi: data.esi,
      tds: data.tds,
      type: data.type,
      pf: data.pf,
      deductions: data.deductions,
      reason: data.reason,
      idType: data.idType,
    });
  }
  editSalaryFormSubmit() {
    console.log(this.editSalaryForm.value);
    const payload = {
      employee: this.editSalaryForm.value.employee,
      netSalary: this.editSalaryForm.value.netSalary,
      basicSalary: this.editSalaryForm.value.basicSalary,
      hra: this.editSalaryForm.value.hra,
      esi: this.editSalaryForm.value.esi,
      special: this.editSalaryForm.value.special,
      id: this.salaryId,
    };
    // if (this.editSalaryForm.valid) {
    console.log("valid form");
    console.log(payload);
    this.Service.updateEmployeeSalaryData(payload).subscribe((resp: any) => {
      console.log(resp);
      if (resp) {
        if (resp.status === "success") {
          const message = "Salary has been updated";
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
