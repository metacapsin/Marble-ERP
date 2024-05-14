import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { routes } from 'src/app/shared/routes/routes';
import { payrollService } from '../payroll.service';
import { Router } from '@angular/router';
import { staffService } from '../../staff/staff.service';
interface data {
  value: string ;
}
@Component({
  selector: 'app-add-salary',
  templateUrl: './add-salary.component.html',
  styleUrls: ['./add-salary.component.scss']
})
export class AddSalaryComponent {
  public routes = routes;
  public selectedValue ! : string ;
  addSalaryForm! : FormGroup;
  employee: [];

  // staff= [
  //   {value: 'Select Staff'},
  //   {value: 'Harfool'},
  //   {value: 'Adnan'},
  //   {value: 'nadim'},
  //   {value: 'kavye'},
  // ];
  type= [
    {value: 'Select Type'},
    {value: 'cash'},
    {value: 'online'},
  ];
   NoAlfregex = /^[^\sA-Za-z]+$/;
  
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private Service: payrollService,
    private router: Router,
    private service: staffService
  ){
    this.addSalaryForm = this.fb.group({
      employee: ['', Validators.required],
      netSalary: ['', [Validators.required, Validators.min(1000) , Validators.max(1000000),Validators.pattern(this.NoAlfregex)]],
      basicSalary: ['', [Validators.required, Validators.min(1000) , Validators.max(1000000),Validators.pattern(this.NoAlfregex)]],
      hra: ['', [Validators.required, Validators.min(1000) , Validators.max(100000)]],
      esi: ['', [Validators.required, Validators.min(1000) , Validators.max(1000000),Validators.pattern(this.NoAlfregex)]],
      tds: ['', [Validators.required, Validators.min(1000) , Validators.max(100000),Validators.pattern(this.NoAlfregex)]],
      type: ['',Validators.required],
      pf: ['', [Validators.required, Validators.min(1000) , Validators.max(100000),Validators.pattern(this.NoAlfregex)]],
    });
  }

  ngOnInit(): void {
    this.service.getStaffData().subscribe((resp: any) => {
      this.employee = resp;
    });
  }
  addSalaryFormSubmit(){
    const payload ={
      employee: this.addSalaryForm.value.employee,
      netSalary: this.addSalaryForm.value.netSalary,
      basicSalary: this.addSalaryForm.value.basicSalary,
      hra: this.addSalaryForm.value.hra,
      esi: this.addSalaryForm.value.esi,
      tds: this.addSalaryForm.value.tds,
      type: this.addSalaryForm.value.type,
      pf: this.addSalaryForm.value.pf,
      
    }
    if (this.addSalaryForm.value) {
      this.Service.addEmployeeSalaryData(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "User has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["payroll/salary"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
  };
}
