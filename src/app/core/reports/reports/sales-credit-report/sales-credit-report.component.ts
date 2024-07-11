import { Component, OnInit } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
import { SalesService } from "src/app/core/sales/sales.service";

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
  salesReportsData = [];
  originalData = []; 
  paymentInData = [];
  paymentOutData = [];
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
  exportColumns: any = [];
  cols: any = [];

  salesCreditReportsData: any = [];
  salesCreditReportDataShowById: any; // to hold sales data by customer id
  showInvoiceDialog: boolean = false; // to enable sales invoice popup
  header = "";
  paymentDataListById: any;

  constructor(private service: ReportsService,
    private salesService: SalesService,

  ) {}

  getPaymentInReportData(startDate: Date, endDate: Date) {
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
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
    });
    this.exportColumns = this.salesReportsData.map((element) => ({
      title: element.header,
      dataKey: element.field,
    }));  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPaymentInReportData(startDate, endDate);
  }

  ngOnInit(): void {
    const today = new Date();
    const endDate = new Date();
    const startDate = new Date(today.getFullYear(), 3, 1);
    this.searchBy = "This Year";
    this.rangeDates = [startDate, endDate];
    console.log(this.getTotalPaidAmount())
    this.getPaymentInReportData(startDate, endDate);
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
