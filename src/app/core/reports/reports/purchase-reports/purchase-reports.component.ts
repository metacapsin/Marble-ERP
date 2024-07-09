import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-purchase-reports',
  // standalone: true,
  // imports: [],
  templateUrl: './purchase-reports.component.html',
  styleUrl: './purchase-reports.component.scss'
})
export class PurchaseReportsComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = ""
  rangeDates: Date[] | undefined;
  purchaseReportsData = [];
  originalData = [];

  cols = [];
  exportColumns = [];

  searchByData = [
    "Today", "Yesterday", "Last 7 Days", "This Month", "Last 3 Months", "Last 6 Months", "This Year"
  ];
  searchBy: string;

  constructor(
    private service: ReportsService
  ) {

  }

  getPaymentOutReportData(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };
    const data2 = {
      startDate: "",
      endDate: "",
    };

    this.service.getPurchaseReports(data).subscribe((resp: any) => {
      console.log(resp);
      this.purchaseReportsData = resp.purchases
      this.originalData = resp.purchases
      this.cols = [
        { field: 'purchaseDate', header: 'Purchase Date' },
        { field: 'purchaseInvoiceNumber', header: 'Purchase Invoice Number' },
        { field: 'supplier.name', header: 'Supplier' },
        { field: 'purchaseType', header: 'Purchase Type' },
        { field: 'paymentStatus', header: 'Payment Status' },
        { field: 'purchaseCost', header: 'Purchase Cost' },
        { field: 'purchaseTotalAmount', header: 'Purchase Total Amount' },
        { field: 'paidAmount', header: 'Paid Amount' },
        { field: 'dueAmount', header: 'Due Amount' }
      ];

      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));
    });
    this.exportColumns = this.purchaseReportsData.map((element) => ({ title: element.header, dataKey: element.field }));
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
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  public searchData(value: any): void {
    this.purchaseReportsData = this.originalData.filter(i => {
      if (!i.supplier || !i.supplier.name) {
        console.warn('Missing supplier or supplier name:', i);
        return false;
      }
      return i.supplier.name.toLowerCase().includes(value.trim().toLowerCase());
    });
  }
  getTotalPaidAmount(): number {
    return this.purchaseReportsData.reduce(
      (total, payment) => total + parseFloat(payment.paidAmount),
      0
    );
  }

  getTotalDueAmount(): number {
    return this.purchaseReportsData.reduce(
      (sum, item) => sum + parseFloat(item.dueAmount),
      0
    );
  }
  getTotalSupplierAmount(): number {
    return this.purchaseReportsData.reduce(
      (sum, item) => sum + parseFloat(item.purchaseCost),
      0
    );
  }

  getTotalPurchaseAmount(): number {
    return this.purchaseReportsData.reduce(
      (sum, item) => sum + parseFloat(item.purchaseTotalAmount),
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