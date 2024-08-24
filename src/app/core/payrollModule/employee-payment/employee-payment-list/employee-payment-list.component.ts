import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { EmployeepPaymentService } from "../employee-payment.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-employee-payment-list",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./employee-payment-list.component.html",
  styleUrl: "./employee-payment-list.component.scss",
  providers: [MessageService],
})
export class EmployeepPaymentListComponent {
  public routes = routes;
  public searchDataValue = "";
  customerList = [];
  saleId: any;
  showDialoge = false;
  modalData: any = {};
  paymentId: any;
  originalData = [];
  visible: boolean = false;
  selectedCategory = [];
  paymentListData:any = [];
  totalAmount: number = 0;
  SalaryPaymentList: any;
  cols = [];
  exportColumns = [];

  constructor(
    private Service: EmployeepPaymentService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.employeeSalaryPaymentList();
  }

  employeeSalaryPaymentList() {
    this.Service.getSalaryPaymentList().subscribe((resp: any) => {
      this.SalaryPaymentList = resp.data;

      this.cols = [
        { field: "employee.name", header: "Employee Name" },
        { field: "month", header: "Month" },
        { field: "totalLeaves", header: "Total Leaves" },
        { field: "netSalary", header: "Net Salary" },
        { field: "totalSalary", header: "Total Salary" },
        { field: "paymentDate", header: "Payment Date" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.SalaryPaymentList.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
      console.log(this.SalaryPaymentList);
    });
    console.log(this.SalaryPaymentList);
  }

  deletePayment(Id: any) {
    this.paymentId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Employee Salary",
    };
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.deleteSalaryPayment(this.paymentId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.employeeSalaryPaymentList();
      this.showDialoge = false;
    });
  }

  close() {
    this.showDialoge = false;
  }
}
