import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { routes } from 'src/app/shared/routes/routes';
import { payrollService } from '../payroll.service';
import { ActivatedRoute, Router } from '@angular/router';
import { staffService } from '../../staff/staff.service';
interface data {
  value: string;
}
@Component({
  selector: 'app-edit-salary',
  templateUrl: './edit-salary.component.html',
  styleUrls: ['./edit-salary.component.scss'],
  providers: [MessageService]
})
export class EditSalaryComponent {
  public routes = routes;
  public selectedValue !: string;
  editSalaryForm!: FormGroup;
  employee: [];
  salaryId: any;
  salaryDataById = [];

  type = [
    { value: 'Select Type' },
    { value: 'cash' },
    { value: 'online' },
  ];

  NoAlfregex = /^[^\sA-Za-z]+$/;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private Service: payrollService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: staffService
  ) {
    this.editSalaryForm = this.fb.group({
      employee: ['', Validators.required],
      netSalary: ['', [Validators.required, Validators.min(1000), Validators.max(1000000), Validators.pattern(this.NoAlfregex)]],
      basicSalary: ['', [Validators.required, Validators.min(1000), Validators.max(1000000), Validators.pattern(this.NoAlfregex)]],
      hra: ['', [Validators.required, Validators.min(1000), Validators.max(100000)]],
      esi: ['', [Validators.required, Validators.min(1000), Validators.max(1000000), Validators.pattern(this.NoAlfregex)]],
      tds: ['', [Validators.required, Validators.min(1000), Validators.max(100000), Validators.pattern(this.NoAlfregex)]],
      type: ['', Validators.required],
      pf: ['', [Validators.required, Validators.min(1000), Validators.max(100000), Validators.pattern(this.NoAlfregex)]],
    });
    this.salaryId = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.Service.getEmployeeSalaryDataById(this.salaryId).subscribe((resp: any) => {
      this.salaryDataById = resp;
      console.log("resp dta", resp);
      this.patchForm(resp);
    })
    this.service.getStaffData().subscribe((resp: any) => {
      this.employee = resp;
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
      pf: data.pf
    });
  }
  editSalaryFormSubmit() {
    console.log(this.editSalaryForm.value)
    const payload = {
      employee: this.editSalaryForm.value.employee,
      netSalary: this.editSalaryForm.value.netSalary,
      basicSalary: this.editSalaryForm.value.basicSalary,
      hra: this.editSalaryForm.value.hra,
      esi: this.editSalaryForm.value.esi,
      tds: this.editSalaryForm.value.tds,
      type: this.editSalaryForm.value.type,
      pf: this.editSalaryForm.value.pf,
      id: this.salaryId

    }
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
              this.router.navigate(["/payroll/salary"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
   }