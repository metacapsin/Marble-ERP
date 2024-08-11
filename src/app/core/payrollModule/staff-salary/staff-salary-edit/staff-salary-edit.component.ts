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
        [ Validators.min(100), Validators.max(100000)],
      ],
      specialPay: [
        "",
        [ Validators.min(100), Validators.max(1000000)],
      ],
      lta: [
        "",
        [ Validators.min(100), Validators.max(100000)],
      ],
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
    this.TotalSalary = 0;
    const basicSalary = this.editSalaryForm.get("basicSalary").value || 0;
    const specialPay = this.editSalaryForm.get("specialPay").value || 0;
    const hra = this.editSalaryForm.get("hra").value || 0;
    const lta = this.editSalaryForm.get("lta").value || 0;
    this.TotalSalary = basicSalary + hra + lta + specialPay;
    // const netSalary = this.TotalSalary - deductions;
    this.editSalaryForm.patchValue({
      netSalary: this.TotalSalary
    });
  }
  patchForm(data) {
    console.log(data);
    this.editSalaryForm.patchValue({
      // employee: data.employee,
      // netSalary: data.netSalary,
      // basicSalary: data.basicSalary,
      // hra: data.hra,
      // esi: data.esi,
      // specialPay: data.specialPay,
      employee: data.employee,
      netSalary: data.netSalary,
      basicSalary: data.basicSalary,
      specialPay: data.specialPay,
      hra: data.hra,
      lta: data.lta,
    });
  }
  editSalaryFormSubmit() {
    console.log(this.editSalaryForm.value);
    const payload = {
      employee: this.editSalaryForm.value.employee,
      netSalary: this.editSalaryForm.value.netSalary,
      basicSalary: this.editSalaryForm.value.basicSalary,
      specialPay: this.editSalaryForm.value.specialPay,
      hra: this.editSalaryForm.value.hra,
      lta: this.editSalaryForm.value.lta,
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
