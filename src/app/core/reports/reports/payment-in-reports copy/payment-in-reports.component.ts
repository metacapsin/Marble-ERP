import { Component } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";

@Component({
  selector: "app-payment-in-reports",
  templateUrl: "./payment-in-reports.component.html"
})
export class PaymentInReportComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = ""
  rangeDates: Date[] | undefined;
  paymetntInData = [];
  originalData = [];

  cols= [];
  exportColumns = [];

  searchByData = [
    "Today", "Yesterday", "Last 7 Days", "This Month", "Last 3 Months", "Last 6 Months", "This Year"
  ];

  constructor(private service: ReportsService) {
  }

  getPaymentInReportData(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };

    this.service.getPaymentInReports(data).subscribe((resp: any) => {
      this.paymetntInData = resp.payments
      this.originalData = resp.payments

      this.cols = [
        { field: 'paymentDate', header: 'Payment Date' },
        { field: 'amount', header: 'Amount' },
        { field: 'paymentMode', header: 'Payment Mode' },
        { field: 'customer.name', header: 'Customer Name' },
        { field: 'transactionNo', header: 'Transaction No' },
        { field: 'source', header: 'Payment Source' }
      ];

      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));
    });
    this.exportColumns = this.paymetntInData.map((element) => ({ title: element.header, dataKey: element.field }));
  }

   getTotalAmount(): number {
        return this.paymetntInData.reduce((total, payment) => total + payment.amount, 0);
    }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPaymentInReportData(startDate, endDate);
  }


  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date();
    this.rangeDates = [startDate, endDate];

    this.getPaymentInReportData(startDate, endDate);
  }


  onSearchByChange(event: any) {
    const value = event.value;
    const today = new Date();
    let startDate, endDate = today;
    switch (value) {
      case 'Today':
        startDate = today;
        endDate = today;
        break;
      case 'YesterDay':
        startDate = new Date(today.setDate(today.getDate() - 1));
        endDate = startDate;
        break;
      case 'Last 7 Days':
        startDate = new Date(today.setDate(today.getDate() - 7));
        endDate = new Date();
        break;
      case 'This Month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'Last 3 Months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        break;
      case 'Last 6 Months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case 'This Year':
        // startDate = new Date(today.getFullYear(), 0, 1);
      
        if (today.getMonth() >= 3) { // Current month is April (3) or later
          startDate = new Date(today.getFullYear(), 3, 1); // April 1st of current year
        } else {
          startDate = new Date(today.getFullYear() - 1, 3, 1); // April 1st of previous year
        }
        break;
    }

    this.rangeDates = [startDate, endDate];
    this.getPaymentInReportData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, '0');
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }

  public searchData(value: any): void {

    this.paymetntInData = this.originalData.filter(item => {
        const searchValue = item.customer?.name?.toLowerCase() || item.supplier?.name?.toLowerCase();
        // const supplierName = item.supplier?.name?.toLowerCase() || '';
        
        return searchValue.includes(value.trim().toLowerCase()) 
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