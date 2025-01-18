import { Component, OnInit } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
import { SalesService } from "src/app/core/sales/sales.service";
import { dashboardService } from "src/app/core/dashboard/dashboard.service";


interface Product {
  id: string;
  _id: string;
  salesInvoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNo: number;
  expanded?: boolean;
  salesOrderStatus: string;
  createdBy: string;
  createdByName: string;
  createdOn: string;
  salesDate: string;
  salesItemDetails: SalesItemDetail[];
  salesOrderTax: number;
  salesTotalAmount: number;
  status: boolean;
}


interface SalesItemDetail {
  maxQuantity: number;
  salesItemProduct: SalesItemProduct;
  salesItemQuantity: number;
  salesItemSubTotal: string;
  salesItemTax: SalesItemTax[];
  salesItemTaxAmount: string;
  salesItemUnitPrice: number;
}

interface SalesItemProduct {
  slabName: string;
  slabNo: string;
  _id: string;
}

interface SalesItemTax {
  createdBy: string;
  createdOn: string;
  name: string;
  status: boolean;
  taxRate: number;
  _id: string;
}


@Component({
  selector: "app-sales-tax-report",
  templateUrl: "./sales-tax-report.component.html",
  styleUrl: "./sales-tax-report.component.scss",
})
export class SalesTaxReportsComponent {
  public routes = routes;
  products: Product[] = [];
  picker1: any;
  searchDataValue = "";
  rangeDates: Date[] | undefined;
  startDate: Date;
  endDate: Date;

  salesTaxReportsData = [];
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
  exportColumns: any=[];
  cols: any=[];
  salesTaxReportDataShowById: any; // to hold sales data by customer id
  showInvoiceDialog: boolean = false; // to enable sales invoice popup
  header = "";
  paymentDataListById: any;
  salesTaxReports = 'salesTaxReports'
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
    return `Sales Tax Reports ${formattedStartDate} ${formattedEndDate}`;
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

    this.service.getSalesTaxReport(data).subscribe((resp: any) => {
      // console.log(resp);
      this.salesTaxReportsData = resp.sales;
      this.originalData = resp.sales;
      this.cols = [
        { field: "salesDate", header: "Sales Date" },
        { field: "salesInvoiceNumber", header: "Sales Invoice Number" },
        { field: "customerName", header: "Customer" },
        { field: "customerPhoneNo", header: "Phone Number" },
        { field: "customerEmail", header: "Email" },
        // { field: "salesOrderStatus", header: "Sales Status" },
        { field: "salesOrderTax", header: "Sales Tax" },
        { field: "salesTotalAmount", header: "Sales Total Amount" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
    });  
  }
  onFilter(value: any){
    // console.log("value Filter", value);
    this.salesTaxReportsData  = value.filteredValue
  }
  getSalesOrderTax():number {
    return this.salesTaxReportsData.reduce(
      (total, payment) => total + Number(payment.salesOrderTax),0);      
  }
  onDateChange(value: any): void {
    // console.log(this.originalData);
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

  toggleRow(product:Product) {
    product.expanded = !product.expanded;
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  // Define the formatTax method to format the tax object as a string
  formatTax(tax: any): string {
    if (typeof tax === 'object' && tax !== null) {
      return `${tax.name}: ${tax.taxRate}`;
    }
    return tax;
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
    // console.log("id pass to invoice dialoge", Id);
    // console.log("showInvoiceDialoge is triggered ");
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.salesTaxReportDataShowById = [resp.data];
      this.header = "Sales Tax Reports Invoice ";
      // console.log("sales data by id On dialog", this.salesTaxReportDataShowById);
    });

    this.salesService.getSalesPaymentList(Id).subscribe((resp: any) => {
      this.paymentDataListById = resp.data;
      // console.log("this is payment by sales id", this.paymentDataListById);
    });
  }

  callBackModal() {}
  close() {
    // console.log("close dialog triggered");
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
  //   this.salesTaxReportsData = this.originalData.filter((i) =>
  //     i.customer.name.toLowerCase().includes(value.trim().toLowerCase())
  //   );
  // }

  // New methods to calculate totals

  // getTotalPaidAmount(): number {
  //   return this.salesTaxReportsData.reduce(
  //     (total, payment) => total + parseFloat(payment.paidAmount),
  //     0
  //   );
  // }

  // getTotalDueAmount(): number {
  //   return this.salesTaxReportsData.reduce(
  //     (sum, item) => sum + parseFloat(item.dueAmount),
  //     0
  //   );
  // }

  // getTotalTaxAmount(): number {
  //   return this.salesTaxReportsData.reduce(
  //     (sum, item) => sum + parseFloat(item.salesOrderTax),
  //     0
  //   );
  // }

  // getTotalSalesAmount(): number {
  //   return this.salesTaxReportsData.reduce(
  //     (sum, item) => sum + parseFloat(item.salesTotalAmount),
  //     0
  //   );
  // }
}

// last 3 month=>{
// today.getFullYear() return year = 2024;
// today.getMonth() return this month = 5 = june ; because jan index is 0 ;
// so 5- 3 = 2 = march;
// today.getDate( return) today date = 6 ;
// startdate= new Date(2024, 2, 6) = it return new date = 03/06/2024
// }
