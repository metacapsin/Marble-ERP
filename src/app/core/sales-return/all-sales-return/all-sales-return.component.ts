import { Component, OnInit } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { routes } from "src/app/shared/routes/routes";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SalesReturnService } from "../sales-return.service";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-all-sales-return",
  templateUrl: "./all-sales-return.component.html",
  styleUrl: "./all-sales-return.component.scss",
  providers: [MessageService],
  standalone: true,
  imports: [
    SharedModule,
    InvoiceDialogComponent,
  ],
})
export class AllSalesReturnComponent implements OnInit {
  public routes = routes;

  public searchDataValue = "";
  selectedSales = "";
  saleId: any;
  showDialoge = false;
  modalData: any = {};
  originalData = [];
  showInvoiceDialog: boolean = false;
  salesReturnListData = [];

  salesDataShowById: any;
  paymentDataListById: any[] = [];
  currentUrl: string;
  header: string;
  totalAmountValues: any = {};
  cols = [];
  exportColumns = [];
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

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private Service: SalesReturnService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.currentUrl = this.router.url;
    console.log(this.currentUrl);
    console.log("this is current url on purchase page", this.currentUrl);

    this.localStorageService.removeItem("customer1");
    this.localStorageService.removeItem("returnUrl");


    // const today = new Date();
    // const endDate = new Date();
    // const startDate = new Date(today.getFullYear(), 3, 1);
    // this.searchBy = "This Year";
    // this.rangeDates = [startDate, endDate];
    // this.GetSalesReturnData(startDate, endDate);

    this.onSearchByChange(this.searchBy);

  }
  navigateToCreateSalesReturn() {
    const returnUrl = this.router.url;
    this.router.navigate(["sales-return/add-sales-return"]);
    this.localStorageService.setItem("returnUrl", returnUrl);

    // this.router.navigate(['/purchase/add-purchase'], { state: { returnUrl: this.currentUrl } });
  }
  deleteSalesReturn(Id: any) {
    this.saleId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Return Details",
    };
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.deleteSalesReturn(this.saleId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.onSearchByChange(this.searchBy);
      this.showDialoge = false;
    });
  }

  close() {
    this.showDialoge = false;
    this.showInvoiceDialog = false;
  }

  GetSalesReturnData(startDate: Date, endDate: Date) {

    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.Service.getSalesReturnList(data).subscribe((resp: any) => {
      this.totalAmountValues = resp;
      this.salesReturnListData = resp.data;
      this.originalData = resp.data;
      this.cols = [
        { field: "salesInvoiceNumber", header: "Sales Invoice Number" },
        { field: "returnDate", header: "Return Date" },
        { field: "customer.name", header: "Customer Name" },
        { field: "returnOrderStatus", header: "Return Order Status" },
        { field: "paymentStatus", header: "Payment Status" },
        { field: "paidAmount", header: "Paid Amount" },
        { field: "dueAmount", header: "Due Amount" },
        { field: "salesTotalAmount", header: "Total Amount" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.salesReturnListData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    });
  }
  editSalesRout(id) {
    this.router.navigate(["/sales-return/edit-sales-return/" + id]);
  }
  showReturnInvoiceDialoge(Id: any) {
    // to open the sales invoice popup
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ");
    this.Service.getSalesReturnById(Id).subscribe((resp: any) => {
      this.header = "Sales Return Invoice"
      this.showInvoiceDialog = true;
      this.salesDataShowById = [resp.data];
      console.log("sales data by id On dialog", this.salesDataShowById);
    });

    this.Service.getSalesReturnPaymentListBySalesReturnId(Id).subscribe(
      (resp: any) => {
        this.paymentDataListById = resp.data;
      }
    );
  }
  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.GetSalesReturnData(startDate, endDate);
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
    this.GetSalesReturnData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
