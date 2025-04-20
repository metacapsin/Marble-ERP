import { Component, OnInit } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
import { dashboardService } from "src/app/core/dashboard/dashboard.service";

@Component({
  selector: 'app-profit-loss-reports',
  templateUrl: './profit-loss-reports.component.html',
  styleUrl: './profit-loss-reports.component.scss'
})
export class ProfitLossReportsComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = ""
  rangeDates:any;
  profitLossData: any = {};

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

  searchBy: string;

  constructor(
    private service: ReportsService,
    private Service:dashboardService,
    private datefilter :dashboardService
  ) { }

  getPaymentInReportData(startDate: Date, endDate: Date) {
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

  downloadProfitLoss() {
    const formattedStartDate = this.formatDateToDDMMYYYY(this.rangeDates[0]);
    const formattedEndDate = this.formatDateToDDMMYYYY(this.rangeDates[1]);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };

    this.service.downloadProfitLoss(data).subscribe((response: ArrayBuffer) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const filename = `Profit Loss Reports ${formattedStartDate}_${formattedEndDate}.xlsx`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Helper function to format date as DD-MM-YYYY
  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPaymentInReportData(startDate, endDate);

    // let payload = {
    //   endDate:  endDate,
    //   startDate: startDate,
    // };
    // this.Service.updAtedateRange(payload).subscribe((resp) => {
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
        let rec={
          value:dates.filterby
        }
        this.onSearchByChange(rec)
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
  


  // onSearchByChange(event: any) {
  //   const value = event.value;
  //   const today = new Date();
  //   let startDate, endDate = today;
  //   switch (value) {
  //     case 'Today':
  //       startDate = new Date(today);
  //       endDate = new Date(today);
  //       break;
  //     case 'Yesterday':
  //       startDate = new Date(today);
  //       startDate.setDate(today.getDate() - 1);
  //       endDate = new Date(startDate);
  //       break;
  //     case 'Last 7 Days':
  //       startDate = new Date(today);
  //       startDate.setDate(today.getDate() - 7);
  //       endDate = new Date(today);
  //       break;
  //     case 'This Month':
  //       startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  //       endDate = new Date(today);
  //       break;
  //     case 'Last 3 Months':
  //       startDate = new Date(today);
  //       startDate.setMonth(today.getMonth() - 3);
  //       endDate = new Date(today);
  //       break;
  //     case 'Last 6 Months':
  //       startDate = new Date(today);
  //       startDate.setMonth(today.getMonth() - 6);
  //       endDate = new Date(today);
  //       break;
  //     case 'This Year':
  //       if (today.getMonth() >= 3) { // Current month is April (3) or later
  //         startDate = new Date(today.getFullYear(), 3, 1); // April 1st of current year
  //       } else {
  //         startDate = new Date(today.getFullYear() - 1, 3, 1); // April 1st of previous year
  //       }
  //       endDate = new Date(today);
  //       break;
  //     default:
  //       startDate = null;
  //       endDate = null;
  //       break;
  //   }

  //   this.rangeDates = [startDate, endDate];
  //   this.getPaymentInReportData(startDate, endDate);

  //   let payload = {
  //     filterby: value,
  //   };

  //   this.Service.updAtedateRange(payload).subscribe((resp) => {
  //     console.log("updt date resp", resp);
  //   });
  // }

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
          startDate.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday of this week
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6); // Sunday of this week
          break;
  
        case "Last Week":
          startDate = new Date(today);
          startDate.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -13 : -6)); // Monday of last week
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6); // Sunday of last week
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
      console.log("Start Date:", startDate, "End Date:", endDate);
      this.getPaymentInReportData(startDate, endDate);

      // let payload = {
      //   filterby: value,
      //   endDate: formattedDate2,
      //   startDate: formattedDate1,
      // };

      // this.Service.updAtedateRange(payload).subscribe((resp) => {
      //   console.log("updt date resp", resp);
      // });
    }
  }

  formatDate(date: Date): any {
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