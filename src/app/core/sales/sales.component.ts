import { Component, OnInit } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { routes } from "src/app/shared/routes/routes";
import { SalesService } from "./sales.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { s } from "@fullcalendar/core/internal-common";
import { dashboardService } from "../dashboard/dashboard.service";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
  standalone: true,
  imports: [SharedModule, InvoiceDialogComponent],
  providers: [MessageService],
})
export class SalesComponent implements OnInit {
  public routes = routes;
  public searchDataValue = "";
  paymentListData = [];
  saleId: any;
  showDialoge = false;
  modalData: any = {};
  showInvoiceDialog: boolean = false;
  salesDataById = [];
  salesListData = [];
  currentUrl: string;
  header: any;
  searchByData = [
    "Today",
    "YesterDay",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Quarter",
    "Last Quarter",
    "This Year",
    "Last Year",
  ];
  searchBy: string = "";
  rangeDates: Date[] | undefined;
  totalAmountValues: any = {};
  cols = [];
  exportColumns = [];
  showDataLoader: boolean = false;
  StartdDate: any;
  enddDate: any;
  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private Service: SalesService,
    private localStorageService: LocalStorageService,
    private datefilter: dashboardService
  ) {}

  ngOnInit() {
    let startDate: Date;
    let endDate: Date;
    this.datefilter.getUpdatedTime().subscribe((resp: any) => {
      let dates = resp.data;
      console.log("Received Dates:", dates);

      if (dates.startUtc && dates.endUtc) {
        startDate = new Date(dates.startUtc);
        endDate = new Date(dates.endUtc);
        this.searchBy = dates.filterby;

        let sDate = new Date(dates.startUtc);
        let eDate = new Date(dates.endUtc);
        let aDate = [sDate, eDate];

        this.onDateChange(aDate);
      } else {
        console.log(" Dates:");
        startDate = new Date(new Date().getFullYear(), 0, 1);
        endDate = new Date();
        this.searchBy = "This Year";
      }

      console.log(" Dates:>>", startDate, endDate);
      const Sdate = this.formatDate(startDate);
      const Edate = this.formatDate(endDate);

      this.rangeDates = [startDate, endDate];
      console.log("Formatted Dates:", Sdate, Edate);
    });
    // this.GetSalesData();
    this.currentUrl = this.router.url;
    console.log("this is current url on sales page", this.currentUrl);
    this.localStorageService.removeItem("customer");
    this.localStorageService.removeItem("returnUrl");

    this.showDataLoader = true;
    this.onSearchByChange(this.searchBy);
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
      this.onSearchByChange(this.searchBy || 'This Year');
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
  navigateToEditSale(_id: any) {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    console.log(
      "this is return url on sales  page for sales create",
      returnUrl
    );
    this.router.navigate([`/sales/edit-sales/${_id}`]);
  }

  GetSalesData(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    this.Service.GetSalesData(data).subscribe((resp: any) => {
      if (resp) {
        this.totalAmountValues = resp;
        this.salesListData = resp.data;
        this.cols = [
          { field: "salesInvoiceNumber", header: "Sales Invoice Number" },
          { field: "salesDate", header: "Sales Date" },
          { field: "customer.name", header: "Customer Name" },
          {
            field: "billingAddress.companyName",
            header: "Billing Address Company Name",
          },
          { field: "salesOrderStatus", header: "Sales Order Status" },
          { field: "paymentStatus", header: "Payment Status" },
          { field: "paidAmount", header: "Paid Amount" },
          { field: "dueAmount", header: "Due Amount" },
          { field: "salesGrossTotal", header: "Sales Gross Total" },
          { field: "salesOrderStatus", header: "Sales Order Status" },
          { field: "salesOrderTax", header: "Sales Order Tax" },
          { field: "salesShipping", header: "Sales Shipping" },
          { field: "salesTotalAmount", header: "Sales Total Amount" },
          { field: "taxable", header: "Sales Taxable Amount" },
          { field: "nonTaxable", header: "Sales Non Taxable Amount" },
          { field: "createdOn", header: "Created On" },
        ];
        this.exportColumns = this.cols.map((col) => ({
          title: col.header,
          dataKey: col.field,
        }));
        this.showDataLoader = false;
      }
    });
  }

  editSalesRout(id) {
    this.router.navigate(["/sales/edit-sales/" + id]);
  }

  showInvoiceDialoge(Id: any) {
    this.Service.GetSalesDataById(Id).subscribe((resp: any) => {
      this.header = "Sales Invoice";

      this.salesDataById = [resp.data];
      console.log("sales data by id On dialog", this.salesDataById);
      this.showInvoiceDialog = true;
    });

    this.Service.getSalesPaymentList(Id).subscribe((resp: any) => {
      this.paymentListData = resp.data;
    });
  }

  close() {
    this.showDialoge = false;
    this.showInvoiceDialog = false;
  }

  onDateChange(value: any): void {
    console.log("value", value);
    const startDate = value[0];
    const endDate = value[1];

    this.StartdDate = value[0];
    this.enddDate = value[1];
    this.GetSalesData(startDate, endDate);

    // let payload = {
    //   endDate: endDate,
    //   startDate: startDate,
    // };

    // this.datefilter.updAtedateRange(payload).subscribe((resp) => {
    //   console.log("updt date resp", resp);
    // });
  }

  onSearchByChange(event: any) {
    const today = new Date();
    let startDate: Date,
      endDate = today;
    switch (event) {
      case "Today":
        startDate = new Date(today);
        break;

      case "YesterDay":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(startDate);
        break;

      case "This Week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() + 1); // Start from Monday
        break;

      case "Last Week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - 6); // Last Monday
        endDate = new Date(today);
        endDate.setDate(startDate.getDate() + 6); // Last Sunday
        break;

      case "This Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;

      case "Last Month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
        break;

      case "This Quarter":
        const currentQuarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
        break;

      case "Last Quarter":
        const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
        const yearForLastQuarter =
          lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
        startDate = new Date(
          yearForLastQuarter,
          (lastQuarter < 0 ? 3 : lastQuarter) * 3,
          1
        );
        endDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 3,
          0
        );
        break;

      case "This Year":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;

      case "Last Year":
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;

      default:
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date();
        break;
    }
    this.rangeDates = [startDate, endDate];
    console.log(startDate, endDate);
    this.GetSalesData(startDate, endDate);

    // let payload = {
    //   filterby: event,
    //   endDate: endDate,
    //   startDate: startDate,
    // };

    // this.datefilter.updAtedateRange(payload).subscribe((resp) => {
    //   console.log("updt date resp", resp);
    // });
  }

  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, "0");
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
