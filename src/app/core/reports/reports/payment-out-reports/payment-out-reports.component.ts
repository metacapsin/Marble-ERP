import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DataService } from "src/app/shared/data/data.service";
import { SettingsService } from "src/app/shared/data/settings.service";
import {
  pageSelection,
  apiResultFormat,
  invoicereport,
} from "src/app/shared/models/models";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { ReportsService } from "../reports.service";
interface data {
  value: string;
}
@Component({
  selector: "app-payment-out-reports",
  // standalone: true,
  // imports: [],
  templateUrl: "./payment-out-reports.component.html",
  // styleUrl: "./payment-in-reports.component.scss",
})
export class PaymentOutReportComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = ""  

  rangeDates: Date[] | undefined;
  paymentOutData = [];
  originalData = [];

  cols= [];
  exportColumns = [];


  searchByData = [
    "Today", "Yesterday", "Last 7 Days", "This Month", "Last 3 Months", "Last 6 Months", "This Year"
  ];
  searchBy: string;

  constructor(private service: ReportsService) {}

  getPaymentOutReportData(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };

    this.service.getPaymentOutReports(data).subscribe((resp: any) => {
      this.paymentOutData = resp.payments
      this.originalData = resp.payments

      this.cols = [
        { field: 'paymentDate', header: 'Payment Date' },
        { field: 'amount', header: 'Amount' },
        { field: 'paymentMode', header: 'Payment Mode' },
        { field: 'customer.name', header: 'Name' },
        { field: 'transactionNo', header: 'Transaction No' }
      ];

      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));
    });
    this.exportColumns = this.paymentOutData.map((element) => ({ title: element.header, dataKey: element.field }));
  }

   getTotalAmount(): number {
        return this.paymentOutData.reduce((total, payment) => total + payment.amount, 0);
    }


  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPaymentOutReportData(startDate, endDate);
  }


  ngOnInit(): void {
    const today = new Date();
    const endDate = new Date();
    const startDate = new Date(today.getFullYear(), 3, 1);
    this.searchBy = 'This Year';
    this.rangeDates = [startDate, endDate];

    this.getPaymentOutReportData(startDate, endDate);
  }


   onSearchByChange(event: any) {
    const value = event.value;
    const today = new Date();
    let startDate, endDate = new Date(today);

    switch (value) {
      case 'Today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'Yesterday':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case 'Last 7 Days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
        break;
      case 'This Month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      case 'Last 3 Months':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        endDate = new Date(today);
        break;
      case 'Last 6 Months':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        endDate = new Date(today);
        break;
      case 'This Year':
        if (today.getMonth() >= 3) { // Current month is April (3) or later
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
    this.getPaymentOutReportData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, '0');
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }

  // public searchData(value: any): void {
  //   this.paymentOutData = this.originalData.filter(i =>
  //     i.customer.name.toLowerCase().includes(value.trim().toLowerCase())
  //   );
  // }

  public searchData(value: any): void {
    const searchTerm = value.trim().toLowerCase();

    this.paymentOutData = this.originalData.filter(item => {
        const customerName = item.customer?.name?.toLowerCase() || '';
        const supplierName = item.supplier?.name?.toLowerCase() || '';
        
        return customerName.includes(searchTerm) || supplierName.includes(searchTerm);
    });
}
}

// last 3 month=>{
// today.getFullYear() return year = 2024;
// today.getMonth() return this month = 5 = june ; because jan index is 0 ;
// so 5- 3 = 2 = march;
// today.getDate( return) today date = 6 ;
// startdate= new Date(2024, 2, 6) = it return new date = 03/06/2024
// }