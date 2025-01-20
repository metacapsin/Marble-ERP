import { Component, OnInit } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { routes } from "src/app/shared/routes/routes";
import { QuotationsService } from "../quotations.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { dashboardService } from "../../dashboard/dashboard.service";

@Component({
  selector: 'app-list-quotations',
  templateUrl: './list-quotations.component.html',
  styleUrl: './list-quotations.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    InvoiceDialogComponent,
  ],
  providers: [MessageService],
})
export class ListQuotationsComponent implements OnInit {
  public routes = routes;
  public searchDataValue = "";
  paymentListData = [];
  quotationsId: any;
  showDialoge = false;
  modalData: any = {};
  showInvoiceDialog: boolean = false;
  quotationDataById = [];
  quotationListData = [];
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
  totalAmountValues: any = {}
  cols = [];
  exportColumns = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private Service: QuotationsService,
    private localStorageService: LocalStorageService,
    private datefilter : dashboardService,
  ) { }

  ngOnInit() {

    let startDate: Date;
    let endDate: Date;
    this.datefilter.getUpdatedTime().subscribe((resp: any) => {
      let dates = resp.data;
      console.log("Received Dates:", dates);

      if (dates.startUtc && dates.endUtc) {
        startDate = new Date(dates.startUtc);
        endDate = new Date(dates.endUtc);
        this.searchBy = dates.filterby
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
    // this.GetQuotationsData();
    this.currentUrl = this.router.url;
    console.log("this is current url on sales page", this.currentUrl);
    this.localStorageService.removeItem("customer");
    this.localStorageService.removeItem("returnUrl");
    this.onSearchByChange(this.searchBy)

  }

  deleteQuotations(Id: any) {
    this.quotationsId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Quotation",
    };
    this.showDialoge = true;
  }

  editQuotation(id) {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    console.log(
      "this is return url on quotations  page for quotations create",
      returnUrl
    );
    this.router.navigate(["/quotations/edit-quotations/" + id]);
}

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.deleteQuotation(this.quotationsId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.onSearchByChange(this.searchBy)
      this.showDialoge = false;
    });
  }

  navigateToCreateQuotation() {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    console.log(
      "this is return url on quotations  page for quotations create",
      returnUrl
    );
    this.router.navigate(["/quotations/add-quotations"]);
  }

  GetQuotationsData(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    this.Service.getQuotationList(data).subscribe((resp: any) => {
      this.totalAmountValues = resp;
      this.quotationListData = resp.data;
      this.cols = [
        { field: "quotationInvoiceNumber", header: "Payment Date" },
        { field: "quotationDate", header: "Quotation Date" },
        { field: "customer.name", header: "Customer Name" },
        { field: "quotationTax", header: "Quotation Tax" },
        { field: "quotationDiscount", header: "Quotation Discount" },
        { field: "otherCharges", header: "Other Charges" },
        { field: "quotationGrossTotal", header: "Quotation Gross Total" },
        { field: "quotationTax", header: "Quotation Tax" },
        { field: "quotationShipping", header: "Quotation Shipping" },
        { field: "paidAmount", header: "Paid Amount" },
        { field: "dueAmount", header: "Due Amount" },
        { field: "createdOn", header: "createdOn" },
        { field: "quotationTotalAmount", header: "Quotation Total Amount" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.quotationListData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    });
  }


  showInvoiceDialoge(Id: any) {
    this.Service.getQuotationById(Id).subscribe((resp: any) => {
      this.header = "Quotation Invoice";
      this.showInvoiceDialog = true;
      this.quotationDataById = [resp.data];
      console.log("quotation data by id On dialog", this.quotationDataById);
    });
    // this.Service.getSalesPaymentList(Id).subscribe((resp: any) => {
    //   this.paymentListData = resp.data;
    // });
  }

  close() {
    this.showDialoge = false;
    this.showInvoiceDialog = false;
  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.GetQuotationsData(startDate, endDate);

    let payload = {
      endDate: endDate,
      startDate: startDate,
    };

    this.datefilter.updAtedateRange(payload).subscribe((resp) => {
      console.log("updt date resp", resp);
    });
  }

  onSearchByChange(event: any) {
    const today = new Date();
    let startDate,
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
          startDate = null;
          endDate = null;
          break;
      }
    this.rangeDates = [startDate, endDate];
    this.GetQuotationsData(startDate, endDate);
    let payload = {
      filterby: event,
      endDate: endDate,
      startDate: startDate,
    };

    this.datefilter.updAtedateRange(payload).subscribe((resp) => {
      console.log("updt date resp", resp);
    });
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
