import { Component, OnInit } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { routes } from "src/app/shared/routes/routes";
import { SalesService } from "./sales.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
  standalone: true,
  imports: [
    SharedModule,
    InvoiceDialogComponent,
  ],
  providers: [MessageService],
})
export class SalesComponent implements OnInit {
  public routes = routes;
  public searchDataValue = "";
  paymentListData = [];
  saleId: any;
  showDialoge = false;
  modalData: any = {};
  originalData = [];
  showInvoiceDialog: boolean = false;
  salesDataById = [];
  salesListData = [];
  totalPaidAmount: any;
  totalDueAmount: any;
  totalAmount: any;
  currentUrl: string;
  header: any;
  searchByData = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "This Month",
    "Last 3 Months",
    "Last 6 Months",
    "This Year",
  ];
  searchBy: string;
  rangeDates: Date[] | undefined;

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private Service: SalesService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.GetSalesData();
    this.currentUrl = this.router.url;
    console.log("this is current url on sales page", this.currentUrl);
    this.localStorageService.removeItem("customer");
    this.localStorageService.removeItem("returnUrl");


    const today = new Date();
    const endDate = new Date();
    const startDate = new Date(today.getFullYear(), 3, 1);
    this.searchBy = "This Year";
    this.rangeDates = [startDate, endDate];

    this.getPaymentInReportData(startDate, endDate);
  }

  deleteSales(Id: any) {
    this.saleId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Details",
    };
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.DeleteSalesData(this.saleId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.GetSalesData();
      this.showDialoge = false;
    });
  }

  navigateToCreateSale() {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    console.log(
      "this is return url on sales  page for sales create",
      returnUrl
    );
    this.router.navigate(["/sales/add-sales"]);
  }

  GetSalesData() {
    this.Service.GetSalesData().subscribe((resp: any) => {
      this.totalPaidAmount = resp.totalPaidAmount;
      this.totalDueAmount = resp.totalDueAmount;
      this.totalAmount = resp.totalAmount;
      this.salesListData = resp.data;
      this.originalData = resp.data;
    });
  }

  editSalesRout(id) {
    this.router.navigate(["/sales/edit-sales/" + id]);
  }

  showInvoiceDialoge(Id: any) {
    this.Service.GetSalesDataById(Id).subscribe((resp: any) => {
      this.header = "Sales Invoice";
      this.showInvoiceDialog = true;
      this.salesDataById = [resp.data];
      console.log("sales data by id On dialog", this.salesDataById);
    });

    this.Service.getSalesPaymentList(Id).subscribe((resp: any) => {
      this.paymentListData = resp.data;
    });
  }

  close() {
    this.showDialoge = false;
    this.showInvoiceDialog = false;
  }

  getPaymentInReportData(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPaymentInReportData(startDate, endDate);
  }

  onSearchByChange(event: any) {
    const value = event.value;
    const today = new Date();
    let startDate,
      endDate = today;
    switch (value) {
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
    this.getPaymentInReportData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
