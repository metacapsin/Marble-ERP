import { Component } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { PaymentOutService } from "../payment-out.service";
import { MessageService } from "primeng/api";

interface Product {
  _id: string;
  purchaseId: string;
  purchaseInvoice: string | null;
  paymentDate: string;
  paymentMode: string;
  amount: number;
  transactionNo: string;
  note: string;
  supplier: {
    _id: string;
    name: string;
    billingAddress: string;
  };
    purchaseInvoiceNumber: string;
  paymentDetails: Array<{
    amountType: string;
    amount: number;
    paymentMode: string;
  }>;
  expanded?: boolean;

}

@Component({
  selector: "app-payment-in-list",
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: "./payment-out-list.component.html",
  styleUrl: "./payment-out-list.component.scss",
  providers: [MessageService],
})
export class PaymentOutListComponent {
  public routes = routes;
  public searchDataValue = "";
  customerList = [];
  products: Product[] = [];
  expanded?: boolean;
  saleId: any;
  showDialoge = false;
  modalData: any = {};
  paymentId: any;
  originalData = [];
  visible: boolean = false;
  selectedCategory = [];
  paymentListData = [];
  cols = [];
  exportColumns = [];

  constructor(
    private Service: PaymentOutService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPaymentList();
  }

  getPaymentList() {
    this.Service.getPurchasePaymentList().subscribe((resp: any) => {
      this.paymentListData = resp.data;
      this.cols = [
        { field: "purchaseInvoiceNumber", header: "Invoice Number" },
        { field: "paymentDate", header: "Payment Date" },
        { field: "supplier.name", header: "Supplier Name" },
        { field: "paymentMode", header: "Payment Mode" },
        { field: "transactionNo", header: "Transaction No" },
        { field: "createdOn", header: "Created On" },
        { field: "note", header: "Note" },
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
      console.log(resp);
    });
  }

  toggleRow(product:Product) {
    product.expanded = !product.expanded;
  }

  deletePayment(Id: any) {
    this.paymentId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Out Details",
    };
    this.showDialoge = true;
  }
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.Service.deletePurchasePayment(this.paymentId).subscribe(
      (resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getPaymentList();
        this.showDialoge = false;
      }
    );
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
