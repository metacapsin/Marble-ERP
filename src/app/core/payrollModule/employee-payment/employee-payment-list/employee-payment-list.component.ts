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
  paymentListData = [];
  totalAmount: number = 0;

  constructor(
    private Service: EmployeepPaymentService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPaymentList();
  }

  getPaymentList() {
    this.Service.getSalaryPaymentList().subscribe((resp: any) => {
      // this.totalAmount = resp.totalAmount;
      this.paymentListData = resp.data;
    });
  }

  deletePayment(Id: any) {
    this.paymentId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Details",
    };
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    // this.Service.deletePaymentById(this.paymentId).subscribe((resp: any) => {
    //   this.messageService.add({ severity: "success", detail: resp.message });
    //   this.getPaymentList();
    //   this.showDialoge = false;
    // });
  }

  close() {
    this.showDialoge = false;
  }

  public searchData(value: any): void {
    // this.categoriesListData = this.originalData.map(i => {
    //   if (i.name.toLowerCase().includes(value.trim().toLowerCase())) {
    //     return i;
    //   }
    // });
  }
}
