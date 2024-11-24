  import { CommonModule } from "@angular/common";
  import { Component } from "@angular/core";
  import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
  import { CalendarModule } from "primeng/calendar";
  import { DropdownModule } from "primeng/dropdown";
  import { routes } from "src/app/shared/routes/routes";
  import { SharedModule } from "src/app/shared/shared.module";
  // import { CustomersdataService } from "../../Customers/customers.service";
  import { EmployeepPaymentService } from "../employee-payment.service";
  import { MessageService } from "primeng/api";
  import { ToastModule } from "primeng/toast";
  import { Router } from "@angular/router";
  import { min } from "rxjs";
  import { StaffSalaryService } from "../../staff-salary/staff-salary.service";

  @Component({
    selector: "app-employee-payment-add",
    standalone: true,
    imports: [
      SharedModule,
    ],
    templateUrl: "./employee-payment-add.component.html",
    styleUrl: "./employee-payment-add.component.scss",
    providers: [MessageService],
  })
  export class EmployeepPaymentAddComponent {
    public routes = routes;
    addEmployeepPaymentForm!: FormGroup;
    customerList = [];
    originalCustomerData = [];

    selectedCustomer: any;
    salesDataById = [];
    paymentModeList = [
      {
        paymentMode: "Cash",
      },
      {
        paymentMode: "Online",
      },
    ];
    maxDate = new Date();
    notesRegex = /^(?:.{2,100})$/;
    nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
    salaryData: any;
    originalData: any;
    employeeList: any =[];
    TotalSalary:any
    SalaryPaymentListByEmployeeId: any;
    employeeLeavesData: any =[ ];

    constructor(
      private Service: EmployeepPaymentService,
      public service: StaffSalaryService,
      private messageService: MessageService,
      private router: Router,
      private fb: FormBuilder
    ) {
      this.addEmployeepPaymentForm = this.fb.group({
        payment: this.fb.array([]),
        employee: ["", [Validators.required]],
        netSalary: ["",],
        totalLeaves: ["",],
        date:["",[Validators.required]],
        paymentDate:["",[Validators.required]],
        paymentMode:["",[Validators.required]],
        TotalSalary: ["", []],
        deduction: ["", [Validators.min(0)]],
      });
    }
    get payment(): FormArray {
      return this.addEmployeepPaymentForm.get("payment") as FormArray;
    }

    addEmployeeControls() {
      this.payment.clear();
      this.salesDataById.forEach((pay) => {
        this.payment.push(
          this.fb.group({
            _id: [pay._id],
            amount: [
              "",
              [
                Validators.required,
                Validators.min(1),
              ],
            ],
          })
        );
      });
    }

    ngOnInit(): void {
      this.service.getEmployeeSalaryData().subscribe((resp: any) => {
        this.employeeList = [];
        this.originalData = resp;
        this.originalData.forEach((element)=>{
          this.employeeList.push({
            name:element.employee.name,
            id:element.employee
          })
        })
      });
    }
    onSelect() {
      const employee = this.addEmployeepPaymentForm.get("employee").value;
      const date = this.addEmployeepPaymentForm.get("date").value;
      const [month, year] = date.split('/');
      if(month || year || employee){
        const data = {
          employeeId:employee._id,
          month:month,
          year:year
        } 
        this.Service.getEmployeeLeaves(data).subscribe((resp: any) => {
          this.employeeLeavesData = resp.data;
          this.addEmployeepPaymentForm.patchValue({
            netSalary:this.employeeLeavesData.employee.netSalary | 0,
            totalLeaves:this.employeeLeavesData.leaves | 0
          })

          this.addEmployeepPaymentForm.get("deduction").clearValidators();
          this.addEmployeepPaymentForm.get('deduction').setValidators([Validators.min(0),Validators.max(resp.data?.employee?.netSalary)]);
          this.addEmployeepPaymentForm.get("deduction").updateValueAndValidity();
        });
      }
    }
    calculateSalary(){
      const deduction = this.addEmployeepPaymentForm.get("deduction").value | 0;
      const netSalary = this.addEmployeepPaymentForm.get("netSalary").value | 0;
      // if(deduction > netSalary){
      //   this.addEmployeepPaymentForm.get("deduction").setErrors({ 'pattern': true });
      //   this.TotalSalary = netSalary;
      //   this.addEmployeepPaymentForm.patchValue({
      //     TotalSalary:this.TotalSalary,
      //   })
      // }else{
      // }
      this.TotalSalary = netSalary - deduction;
      this.addEmployeepPaymentForm.patchValue({
        TotalSalary:this.TotalSalary,
      })
    }
    addEmployeepPaymentFormSubmit() {
      const formData = this.addEmployeepPaymentForm.value;
      const date = this.addEmployeepPaymentForm.get("date").value;
      const [month, year] = date.split('/');
      console.log("Submitted data:", formData);

      const payload = {
        employee: formData.employee,
        netSalary: formData.netSalary,
        totalLeaves: formData.totalLeaves,
        deduction: formData.deduction,
        year:year,
        month:month,
        paymentDate:formData.paymentDate,
        paymentMode:formData.paymentMode,

      };

      if (this.addEmployeepPaymentForm.valid) {
        console.log("valid form");

        this.Service.createPayment(payload).subscribe((resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.status === "success") {
              const message = "Employee Salary has been added.";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["/employee-payment"]);
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        });
      } else {
        console.log("invalid form");
      }
    }
  }
