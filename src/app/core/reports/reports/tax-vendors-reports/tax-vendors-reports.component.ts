import { Component } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
import { dashboardService } from "src/app/core/dashboard/dashboard.service";

@Component({
  selector: "app-tax-vendors-reports",
  templateUrl: "./tax-vendors-reports.component.html",
  styleUrl: "./tax-vendors-reports.component.scss",
})
export class TaxVendorsReportsComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = "";
  rangeDates: Date[] | undefined;
  startDate: Date;
  endDate: Date;

  taxVendorsReportsData = [];
  originalData: any = [];
  originalDataReports: string = "originalDataReports";

  cols = [];
  exportColumns = [];
  activeIndex: number = 0;
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

  constructor(private service: ReportsService,private datefilter:dashboardService) {}

  private formatDateForFilename(date: Date): string {
    return date.toLocaleDateString("en-GB").replace(/\//g, "-"); // e.g., 19-02-2024
  }
  setActiveIndex(event: any) {
    this.activeIndex = event?.index;
  }
  // Function to generate the export filename
  getExportFilename(): string {
    const formattedStartDate = this.formatDateForFilename(this.startDate);
    const formattedEndDate = this.formatDateForFilename(this.endDate);
    return `Tax Vendors Reports ${formattedStartDate} ${formattedEndDate}`;
  }

  getTaxVendorsReportsData(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
    console.log("StartDate", startDate, endDate);

    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.service.getTaxVendorReports(data).subscribe((resp: any) => {
      this.taxVendorsReportsData = resp.sales;
      console.log(
        "this is tax vendors reports data",
        this.taxVendorsReportsData
      );
      this.originalData = resp;

      console.log("this is original data", this.originalData);

      this.cols = [
        {
          field: (item: any) => item.salesDate || item.purchaseDate,
          header: "Date",
          export: (item: any) => {
            const date = item.salesDate || item.purchaseDate;
            return date ? new Date(date).toLocaleDateString() : "";
          },
        },
        { field: "taxVendor.companyName", header: "Company Name" },
        { field: "source", header: "Source" },
        { field: "taxVendor.vendorTaxApplied", header: "Tax Apllied (%)" },
        { field: "taxVendor.paymentStatus", header: "Payment Status" },
        { field: "taxVendor.paidAmount", header: "Paid Amount" },
        { field: "taxVendor.dueAmount", header: "Due Amount" },
        { field: "taxVendor.taxVendorAmount", header: "Total Amount" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.taxVendorsReportsData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    });
  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getTaxVendorsReportsData(startDate, endDate);
    let payload = {
      endDate: endDate,
      startDate: startDate,
    };

    this.datefilter.updAtedateRange(payload).subscribe((resp) => {
      console.log("updt date resp", resp);
    });
  }
  onFilter(value: any) {
    this.taxVendorsReportsData = value.filteredValue;
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

      this.getTaxVendorsReportsData(startDate, endDate);
    });

  
  }

  onSearchByChange(event: any) {
    const value = event.value;
    const today = new Date();
    let startDate,
      endDate = new Date(today);

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
    this.getTaxVendorsReportsData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, "0");
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
