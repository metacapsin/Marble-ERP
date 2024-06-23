import { Component } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
@Component({
  selector: 'app-expenses-reports',
  templateUrl: './expenses-reports.component.html',
})
export class expensesReportsComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = ""
  rangeDates: Date[] | undefined;
  expensesData = [];
  originalData = [];

  categoryData = [];
  subCategoryData = [];

  cols = [];
  exportColumns = [];

  searchByData = [
    "Today", "Yesterday", "Last 7 Days", "This Month", "Last 3 Months", "Last 6 Months", "This Year"
  ];

  constructor(private service: ReportsService) { }

  getExpensesReportData(startDate: Date, endDate: Date) {
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
      ];

      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));
    });
    this.exportColumns = this.expensesData.map((element) => ({ title: element.header, dataKey: element.field }));

  }

  getTotalAmount(): number {
    return this.expensesData.reduce((total, payment) => total + payment.amount, 0);
  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getExpensesReportData(startDate, endDate);
  }


  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = today;
    this.rangeDates = [startDate, endDate];

    this.getExpensesReportData(startDate, endDate);
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
        startDate = new Date(today.getFullYear(), 0, 1);
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