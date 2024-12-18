import { Component, OnInit } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";

@Component({
  selector: 'app-profit-loss-reports',
  templateUrl: './profit-loss-reports.component.html',
  styleUrl: './profit-loss-reports.component.scss'
})
export class ProfitLossReportsComponent{
  public routes = routes;
  picker1: any;
  searchDataValue = ""  
  rangeDates: Date[] | undefined;
  profitLossData:any = {};

  searchByData = [
     "This Month", "Last 3 Months", "Last 6 Months", "This Year"
  ];
  searchBy: string;

  constructor(
    private service:ReportsService
  ) { }

  getPaymentInReportData(startDate: Date, endDate: Date){
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };

    this.service.getProfitLoss(data).subscribe((resp: any) => {
          this.profitLossData = resp.data.results;      
    });
  }

  downloadProfitLoss(){
    console.log(this.rangeDates);
     // Format the start and end dates as DD-MM-YYYY
  const formattedStartDate = this.formatDateToDDMMYYYY(this.rangeDates[0]);
  const formattedEndDate = this.formatDateToDDMMYYYY(this.rangeDates[1]);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };
    
    this.service.downloadProfitLoss(data).subscribe((response: ArrayBuffer) => {
      // const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

          // Convert the data to CSV format
    const csvData = this.generateCSV(this.profitLossData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

     // Set a dynamic filename based on the date range
    const filename = `Profit Loss Reports ${formattedStartDate}_${formattedEndDate}.csv`;
    link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Function to convert the profitLossData to CSV format
generateCSV(data: any): string {
  // Define CSV headers
  const headers = [
    'Category', 'Amount', 'Due Amount', 'Paid Amount'
  ];

  // Collect CSV rows
  const rows = [
    ['Sales', `₹ ${data?.sales || 0}`, `₹ ${data?.salesDueAmount || 0}`, `₹ ${data?.salesPaidAmount || 0}`],
    ['Purchase Returns', `₹ ${data?.purchase_returns || 0}`, `₹ ${data?.purchaseReturnsDueAmount || 0}`, `₹ ${data?.purchaseReturnsPaidAmount || 0}`],
    ['Purchases', `₹ ${data?.purchases || 0}`, `₹ ${data?.purchaseDueAmount || 0}`, `₹ ${data?.purchasePaidAmount || 0}`],
    ['Sales Returns', `₹ ${data?.sales_returns || 0}`, `₹ ${data?.salesReturnsDueAmount || 0}`, `₹ ${data?.salesReturnsPaidAmount || 0}`],
    ['Tax Vendor Expenses', `₹ ${data?.taxVendorExpenses || 0}`, `₹ ${data?.taxVendorDueAmount || 0}`, `₹ ${data?.taxVendorPaidAmount || 0}`],
    ['General Expenses', `₹ ${data?.expenses || 0}`, '', ''],
    ['Salary Expenses', `₹ ${data?.salaryPayments || 0}`, '', ''],
    ['Profit', `₹ ${data?.profit || 0}`, '', '']
  ];

  // Combine headers and rows into CSV string
  const csvContent = [
    headers.join(','), // Header row
    ...rows.map(row => row.join(',')) // Data rows
  ].join('\n'); // Join rows with newline

  return '\uFEFF' + csvContent; // Adding BOM for UTF-8 encoding
}
  // Helper function to format date as DD-MM-YYYY
formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPaymentInReportData(startDate, endDate);
  }
  
  ngOnInit(): void {
    const today = new Date();
    const endDate = new Date();
    const startDate = new Date(today.getFullYear(), 3, 1);
    this.searchBy = 'This Year';
    this.rangeDates = [startDate, endDate];

    this.getPaymentInReportData(startDate, endDate);
  }


  onSearchByChange(event: any) {
    const value = event.value;
    const today = new Date();
    let startDate, endDate = today;
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
    this.getPaymentInReportData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }



}

// last 3 month=>{
// today.getFullYear() return year = 2024;
// today.getMonth() return this month = 5 = june ; because jan index is 0 ;
// so 5- 3 = 2 = march;
// today.getDate( return) today date = 6 ;
// startdate= new Date(2024, 2, 6) = it return new date = 03/06/2024 
// }