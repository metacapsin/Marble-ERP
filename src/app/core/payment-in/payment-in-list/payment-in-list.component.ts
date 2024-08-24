import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { PaymentInService } from "../payment-in.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-payment-in-list",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./payment-in-list.component.html",
  styleUrl: "./payment-in-list.component.scss",
  providers: [MessageService],
})
export class PaymentInListComponent {
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
  cols = [];
  exportColumns = [];
  constructor(
    private Service: PaymentInService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPaymentList();
  }

  getPaymentList() {
    this.Service.getPaymentList().subscribe((resp: any) => {
      this.totalAmount = resp.totalAmount;
      this.paymentListData = resp.data;
      this.cols = [
        { field: "salesInvoice", header: "Invoice Number" },
        { field: "transactionNo", header: "Transaction No" },
        { field: "paymentDate", header: "Payment Date" },
        { field: "customer.name", header: "Customer Name" },
        { field: "paymentMode", header: "Payment Mode" },
        { field: "amount", header: "Amount" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.paymentListData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
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
    this.Service.deletePaymentById(this.paymentId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.getPaymentList();
      this.showDialoge = false;
    });
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
