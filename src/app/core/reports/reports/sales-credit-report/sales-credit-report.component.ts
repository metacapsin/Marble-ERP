import { Component, OnInit } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
import { SalesService } from "src/app/core/sales/sales.service";
import { dashboardService } from "src/app/core/dashboard/dashboard.service";

@Component({
  selector: "app-sales-credit-report",
  templateUrl: "./sales-credit-report.component.html",
  styleUrl: "./sales-credit-report.component.scss",
})
export class SalesCreditReportsComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = "";
  rangeDates: Date[] | undefined;
  startDate: Date;
  endDate: Date;

  salesReportsData = [];
  originalData = []; 
  paymentInData = [];
  paymentOutData = [];
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
  searchBy: string;
  exportColumns: any = [];
  cols: any = [];
  salesCreditReports= 'salesCreditReports'
  salesCreditReportsData: any = [];
  salesCreditReportDataShowById: any; // to hold sales data by customer id
  showInvoiceDialog: boolean = false; // to enable sales invoice popup
  header = "";
  paymentDataListById: any;

  constructor(private service: ReportsService,
    private salesService: SalesService,
    private datefilter:dashboardService

  ) {}
  private formatDateForFilename(date: Date): string {
    return date.toLocaleDateString('en-GB').replace(/\//g, '-'); // e.g., 19-02-2024
  }

  // Function to generate the export filename
  getExportFilename(): string {
    const formattedStartDate = this.formatDateForFilename(this.startDate);
    const formattedEndDate = this.formatDateForFilename(this.endDate);
    return `Sales Credit Reports ${formattedStartDate} ${formattedEndDate}`;
  }

  onFilter(value: any) {
    this.salesCreditReportsData = value.filteredValue;
    console.log(value.filteredValue);
}
  getPaymentInReportData(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };  

    this.service.getSalesCreditReport(data).subscribe((resp: any) => {
      console.log(resp);
      this.salesCreditReportsData = resp.sales;
      this.originalData = resp.sales;
      this.cols = [
        { field: "salesDate", header: "Sales Date" },
        { field: "salesInvoiceNumber", header: "Sales Invoice Number" },
        { field: "customerName", header: "Customer" },
        { field: "customerEmail", header: "Email" },
        { field: "customerPhoneNo", header: "Phone Number" },
        { field: "paymentStatus", header: "Payment Status" },
        { field: "paidAmount", header: "Paid Amount" },
        { field: "dueAmount", header: "Due Amount" },
        { field: "salesTotalAmount", header: "Sales Total Amount" },
        { field: "companyName", header: "Billing Company" }
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
    });
    // this.exportColumns = this.salesReportsData.map((element) => ({
    //   title: element.header,
    //   dataKey: element.field,
    // }));
    }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPaymentInReportData(startDate, endDate);
    let payload = {
      endDate: endDate,
      startDate: startDate,
    };

    this.datefilter.updAtedateRange(payload).subscribe((resp) => {
      console.log("updt date resp", resp);
    });
  }

  ngOnInit(): void {
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

      this.getPaymentInReportData(startDate, endDate);
    });

 
  }

  showInvoiceDialoge(Id: any) {
    // to open the sales invoice popup
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ");
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.salesCreditReportDataShowById = [resp.data];
      this.header = "Sales Credit Reports Invoice ";
      console.log("sales data by id On dialog", this.salesCreditReportDataShowById);
    });

    this.salesService.getSalesPaymentList(Id).subscribe((resp: any) => {
      this.paymentDataListById = resp.data;
      console.log("this is payment by sales id", this.paymentDataListById);
    });
  }


  callBackModal() {}
  close() {
    console.log("close dialog triggered");
    this.showInvoiceDialog = false;

  }

  onSearchByChange(event: any) {
    const value = event.value;
    const today = new Date();
    let startDate,
      endDate = today;
      switch (value) {
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
    this.getPaymentInReportData(startDate, endDate);

    let payload = {
      filterby: value,
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

  // public searchData(value: any): void {
  //   this.salesCreditReportsData = this.originalData.filter((i) =>
  //     i.customer.name.toLowerCase().includes(value.trim().toLowerCase())
  //   );
  // }

  // New methods to calculate totals

  getTotalPaidAmount(): number {
    return this.salesCreditReportsData.reduce(
      (total, payment) => total + parseFloat(payment.paidAmount),
      0
    );
  }

  getTotalDueAmount(): number {
    return this.salesCreditReportsData.reduce(
      (sum, item) => sum + parseFloat(item.dueAmount),

      0
    );
  }

  getTotalSalesAmount(): number {
    return this.salesCreditReportsData.reduce(
      (sum, item) => sum + parseFloat(item.salesTotalAmount),
      0
    );
  }
}

// last 3 month=>{
// today.getFullYear() return year = 2024;
// today.getMonth() return this month = 5 = june ; because jan index is 0 ;
// so 5- 3 = 2 = march;
// today.getDate( return) today date = 6 ;
// startdate= new Date(2024, 2, 6) = it return new date = 03/06/2024
// }
