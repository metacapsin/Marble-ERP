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
    "Today",
    "YesterDay",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Quarter",
    "Last Quarter",
    "This Year",
    "Last Year",
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
    // let payload = {
    //   endDate: endDate,
    //   startDate: startDate,
    // };

    // this.datefilter.updAtedateRange(payload).subscribe((resp) => {
    //   console.log("updt date resp", resp);
    // });
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
        this.searchBy = dates.filterby
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
    console.log(event);
    const value = event.value;
    const today = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = new Date(today);

    switch (value) {
      case "Today":
        startDate = new Date(today);
        break;

      case "YesterDay":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(startDate);
        break;

      case "This Week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() + 1); // Start from Monday
        break;

      case "Last Week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - 6); // Last Monday
        endDate = new Date(today);
        endDate.setDate(startDate.getDate() + 6); // Last Sunday
        break;

      case "This Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;

      case "Last Month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
        break;

        case "This Quarter":
          const currentQuarter = Math.floor(today.getMonth() / 3);
          startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
          break;
  
        case "Last Quarter":
          const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
          const yearForLastQuarter =
            lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
          startDate = new Date(
            yearForLastQuarter,
            (lastQuarter < 0 ? 3 : lastQuarter) * 3,
            1
          );
          endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 3,
            0
          );
          break;

      case "This Year":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;

      case "Last Year":
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;

      default:
        startDate = null;
        endDate = null;
        break;
    }

    this.rangeDates = [startDate, endDate];

    if (startDate && endDate) {
      const formattedDate1 = this.formatDate(startDate);
      const formattedDate2 = this.formatDate(endDate);
      console.log("Start Date:", formattedDate1, "End Date:", formattedDate2);
      this.getExpensesReportData(startDate, startDate);

      // let payload = {
      //   filterby: value,
      //   endDate: formattedDate2,
      //   startDate: formattedDate1,
      // };

      // this.datefilter.updAtedateRange(payload).subscribe((resp) => {
      //   console.log("updt date resp", resp);
      // });
    }
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