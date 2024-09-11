import { Component } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-tax-vendors-reports',
  templateUrl: './tax-vendors-reports.component.html',
  styleUrl: './tax-vendors-reports.component.scss'
})
export class TaxVendorsReportsComponent {

  public routes = routes;
  picker1: any;
  searchDataValue = "";
  rangeDates: Date[] | undefined;
  taxVendorsReportsData = [];
  originalData = [];
  taxVendorsReports = "taxVendorsReports";
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
  searchBy: string;

  constructor(private service: ReportsService){}

  
  getTaxVendorsReportsData(startDate: Date, endDate: Date) {
    console.log("StartDate", startDate, endDate);

    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.service.getTaxVendorReports(data).subscribe((resp: any) => {
      this.taxVendorsReportsData = resp.sales;
      console.log("this is tax vendors reports data",this.taxVendorsReportsData)
      this.originalData = resp.sales;

      console.log("this is original data", this.originalData);

      this.cols = [
        { field: "salesDate", header: "Sales Date" },
        { field: "taxVendor.companyName", header: "Company Name" },
        { field: "vendorTaxApplied", header: "Tax Apllied (%)" },
        { field: "paymentStatus", header: "Payment Status" },
        { field: "paidAmount", header: "Paid Amount" },
        { field: "dueAmount", header: "Due Amount" },
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
  }
  onFilter(value: any) {
    this.taxVendorsReportsData = value.filteredValue;
  }

  ngOnInit(): void {
    const today = new Date();
    const endDate = new Date();
    const startDate = new Date(today.getFullYear(), 3, 1);
    this.searchBy = "This Year";
    this.rangeDates = [startDate, endDate];

    this.getTaxVendorsReportsData(startDate, endDate);
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
