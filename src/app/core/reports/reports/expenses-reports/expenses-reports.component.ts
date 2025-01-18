import { Component } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
import { dashboardService } from "src/app/core/dashboard/dashboard.service";
@Component({
  selector: 'app-expenses-reports',
  templateUrl: './expenses-reports.component.html',
})
export class expensesReportsComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = ""
  rangeDates: Date[] | undefined;
  startDate: Date;
  endDate: Date;
  expensesData = [];
  originalData = [];

  categoryData = [];
  subCategoryData = [];
  expensesDataName = 'expensesDataName'
  cols = [];
  exportColumns = [];
  searchBy:any
  searchByData = [
    "Today", "Yesterday", "Last 7 Days", "This Month", "Last 3 Months", "Last 6 Months", "This Year"
  ];

  constructor(private service: ReportsService,private datefilter : dashboardService) { }

   // Function to format date for filename
   private formatDateForFilename(date: Date): string {
    return date.toLocaleDateString('en-GB').replace(/\//g, '-'); // e.g., 19-02-2024
  }

  // Function to generate the export filename
  getExportFilename(): string {
    const formattedStartDate = this.formatDateForFilename(this.startDate);
    const formattedEndDate = this.formatDateForFilename(this.endDate);
    return `Expenses Reports ${formattedStartDate} ${formattedEndDate}`;
  }

  getExpensesReportData(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };

    this.service.getExpensesReports(data).subscribe((resp: any) => {
      this.expensesData = resp.expenses
      this.originalData = resp.expenses

      this.cols = [
        { field: 'date', header: 'Expenses Date' },
        { field: 'categoryDetails.name', header: 'Expenses Category' },
        { field: 'amount', header: 'Amount' },
        { field: 'recipient', header: 'Recipient' },
        { field: 'notes', header: 'Notes' },
      ];

      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));
    });
    // this.exportColumns = this.expensesData.map((element) => ({ title: element.header, dataKey: element.field }));

  }

  onFilter(value: any) {
    this.expensesData = value.filteredValue;
}

  getTotalAmount(): number {
    return this.expensesData.reduce((total, payment) => total + payment.amount, 0);
  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getExpensesReportData(startDate, endDate);
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

      this.getExpensesReportData(startDate, endDate);
    });

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
    this.getExpensesReportData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, '0');
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }

  public searchData(value: any): void {
    this.expensesData = this.originalData.filter(i =>
      i.categoryDetails.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
}