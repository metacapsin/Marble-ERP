import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { PurchaseReturnService } from "./purchase-return.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
@Component({
  selector: "app-purchase-return",
  standalone: true,
  imports: [
    SharedModule,
    InvoiceDialogComponent,
  ],
  templateUrl: "./purchase-return.component.html",
  styleUrl: "./purchase-return.component.scss",
})
export class PurchaseReturnComponent {
  public routes = routes;
  public searchDataValue = "";

  purchaseReturnData: any;
  originalData: any;
  purchaseReturn: number;
  modalData: { title: string; messege: string };
  showDialoge: boolean;
  showInvoiceDialog: boolean;
  selectedPurchaseReturn: "";
  header: string;
  PurchaseReturnListData: any[];
  paymentDataListById: any[];
  currentUrl: string;
  purchaseTotalValues: any = {};
  searchByData = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "This Month",
    "Last 3 Months",
    "Last 6 Months",
    "This Year",
  ];
  searchBy: string ="This Year";
  rangeDates: Date[] | undefined;
  cols = [];
  exportColumns = [];


  constructor(
    private service: PurchaseReturnService,
    private router: Router,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) { }
  ngOnInit() {
    this.currentUrl = this.router.url;
    console.log(this.currentUrl);
    console.log("this is current url on purchase page", this.currentUrl);

    this.localStorageService.removeItem("supplier1");
    this.localStorageService.removeItem("returnUrl");

    // const today = new Date();
    // const endDate = new Date();
    // const startDate = new Date(today.getFullYear(), 3, 1);
    // this.searchBy = "This Year";
    // this.rangeDates = [startDate, endDate];

    // this.getPurchaseReturn(startDate, endDate);
    this.onSearchByChange(this.searchBy)
  }
  navigateToCreatePurchaseReturn() {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    this.router.navigate(["purchase-return/add-purchase-return"]);
  }
  getPurchaseReturn(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    this.service.getPurchaseReturnList(data).subscribe((resp: any) => {
      this.purchaseTotalValues = resp;
      this.purchaseReturnData = resp.data;
      this.cols = [
        { field: "purchaseInvoiceNumber.purchaseInvoiceNumber", header: "Invoice Number" },
        { field: "returnDate", header: "Date" },
        { field: "supplier.name", header: "Supplier Name" },
        { field: "paymentStatus", header: "Payment Status" },
        { field: "paidAmount", header: "Paid Amount" },
        { field: "dueAmount", header: "Due Amount" },
        { field: "purchaseReturnNotes", header: "Purchase Return Notes" },
        { field: "purchaseGrossTotal", header: "Purchase Gross Total" },
        { field: "purchaseReturnNotes", header: "Purchase Return Notes" },
        { field: "createdOn", header: "Created On" },
        { field: "purchaseReturnTotalAmount", header: "Total Amount" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.purchaseReturnData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    });
  }
  purchaseReturnUpdate(id: any) {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    this.router.navigate(["/purchase-return/edit-purchase-return/" + id]);
  }
  purchaseReturnDelete(id: number) {
    this.purchaseReturn = id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Purchase return",
    };
    this.showDialoge = true;
  }
  callBackModal() {
    this.showDialoge = false;
    this.service
      .deletePurchaseReturn(this.purchaseReturn)
      .subscribe((resp: any) => {
        if (resp.status == "success") {
          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
        } else {
          this.messageService.add({ severity: "error", detail: resp.message });
        }
        this.onSearchByChange(this.searchBy);
      });
  }
  close() {
    // this.visible = false;
    this.showInvoiceDialog = false;
    this.showDialoge = false;
  }
  showInvoiceDialoge(id: any) {
    let totalTax = 0;
    console.log("id pass to invoice dialoge", id);
    console.log("showInvoiceDialoge is triggered ");
    this.service.getPurchaseReturnById(id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.PurchaseReturnListData = [resp.data];
      this.header = "Purchase Return Invoice";
      console.log(this.PurchaseReturnListData[0].lotDetails);
      console.log(this.PurchaseReturnListData);
      console.log(resp);
    });
    this.service
      .getPurchaseReturnPaymentListByPurchaseReturnId(id)
      .subscribe((resp: any) => {
        this.paymentDataListById = resp.data;
        console.log("purchase Return data", resp.data);
      });
  };

  // getPurchaseReturn(startDate: Date, endDate: Date) {
  //   const formattedStartDate = this.formatDate(startDate);
  //   const formattedEndDate = this.formatDate(endDate);
  //   const data = {
  //     startDate: formattedStartDate,
  //     endDate: formattedEndDate,
  //   };
  // }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPurchaseReturn(startDate, endDate);
  }

  onSearchByChange(event: any) {
    const today = new Date();
    let startDate,
      endDate = today;
    switch (event) {
      case "Today":
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case "Yesterday":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case "Last 7 Days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
        break;
      case "This Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      case "Last 3 Months":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        endDate = new Date(today);
        break;
      case "Last 6 Months":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        endDate = new Date(today);
        break;
      case "This Year":
        if (today.getMonth() >= 3) {
          // Current month is April (3) or later
          startDate = new Date(today.getFullYear(), 3, 1); // April 1st of current year
        } else {
          startDate = new Date(today.getFullYear() - 1, 3, 1); // April 1st of previous year
        }
        endDate = new Date(today);
        break;
      default:
        startDate = null;
        endDate = null;
        break;
    }

    this.rangeDates = [startDate, endDate];
    this.getPurchaseReturn(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
