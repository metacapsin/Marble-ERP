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

    constructor(
      // private customerService: CustomersdataService,
      private Service: EmployeepPaymentService,
      public service: StaffSalaryService,
      private messageService: MessageService,
      private router: Router,
      private fb: FormBuilder
    ) {
      this.addEmployeepPaymentForm = this.fb.group({
        payment: this.fb.array([]),
        employee: ["", [Validators.required]],
        date: ["", [Validators.required]],
        netSalary: ["", [Validators.required]],
        totalLeaves: ["", [Validators.required]],
        paymentMode: ["", [Validators.required]],
        nots: ["", []],
        TotalSalary: ["", []],
        deduction: ["", [Validators.pattern(this.notesRegex)]],
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
                // Validators.max(pay.dueAmount),
              ],
            ],
          })
        );
      });
    }

    ngOnInit(): void {
      // this.customerService.GetCustomerData().subscribe((resp: any) => {
      //   this.originalCustomerData = resp;
      //   this.customerList = [];
      //   this.originalCustomerData.forEach((element) => {
      //     this.customerList.push({
      //       name: element.name,
      //       _id: {
      //         _id: element._id,
      //         name: element.name,
      //       },
      //     });
      //   });
      // });
      this.service.getEmployeeSalaryData().subscribe((resp: any) => {
        this.employeeList = [];
        this.originalData = resp;
        this.originalData.forEach((element)=>{
          this.employeeList.push({
            name:element.employee.name,
            _id:element.employee,
          })
        })
        console.log("salary data", this.employeeList);
      });
    }
    onEmployeeSelect(employeeId: any) {
      console.log(employeeId);
      this.Service.getSalaryPaymentListByEmployeeId(employeeId._id).subscribe((resp: any) => {
        this.SalaryPaymentListByEmployeeId = resp.data;
        // console.log("sales Data by id ",this.salesDataById);
        this.addEmployeeControls();
      });
    }
    calculateSalary(){
      const deduction = this.addEmployeepPaymentForm.get("deduction").value | 0;
      const netSalary = this.addEmployeepPaymentForm.get("netSalary").value | 0;
      this.TotalSalary = netSalary - deduction;
    }
    addEmployeepPaymentFormSubmit() {
      const formData = this.addEmployeepPaymentForm.value;
      console.log("Submitted data:", formData);

      const payload = {
        payment: formData.payment,
        employee: formData.employee,
        date: formData.data,
        netSalary: formData.netSalary,
        totalLeaves: formData.totalLeaves,
        paymentMode: formData.paymentMode,
        deduction: formData.deduction,
        nots: formData.nots,
      };

      if (this.addEmployeepPaymentForm.valid) {
        console.log("valid form");

        this.Service.createPayment(payload).subscribe((resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.status === "success") {
              const message = "Payment has been added";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["/payment-in"]);
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
