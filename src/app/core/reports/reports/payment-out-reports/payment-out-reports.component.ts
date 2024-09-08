import { Component, OnInit } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
interface data {
  value: string;
}
@Component({
  selector: "app-payment-out-reports",
  templateUrl: "./payment-out-reports.component.html",
})
export class PaymentOutReportComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = "";
  rangeDates: Date[] | undefined;
  paymentOutData = [];
  originalData = [];
  paymentOut = "paymentOut";
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

  constructor(private service: ReportsService) {}

  getPaymentOutReportData(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    console.log(
      "Start Date:",
      formattedStartDate,
      "End Date:",
      formattedEndDate
    );

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.service.getPaymentOutReports(data).subscribe((resp: any) => {
      this.paymentOutData = resp.payments;
      this.originalData = resp.payments;
      console.log("this is payment out data", resp.payments);

      this.cols = [
        { field: "paymentDate", header: "Payment Date" },
        { field: "amount", header: "Amount" },
        { field: "paymentMode", header: "Payment Mode" },
        { field: "customer.name", header: "Receiver" },
        { field: "transactionNo", header: "Transaction No" },
        { field: "source", header: "Payment Source" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
    });
    // this.exportColumns = this.paymentOutData.map((element) => ({ title: element.header, dataKey: element.field }));
  }

  // getTotalAmount(): number {
  //   return this.paymentOutData.reduce(
  //     (total, payment) =>
  //       total +
  //       payment.amount +
  //       payment.otherCharges +
  //       payment.transportationCharges,
  //     0
  //   );
  // }
  onFilter(value: any) {
    this.paymentOutData = value.filteredValue;
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
    this.searchBy = "This Year";
    this.rangeDates = [startDate, endDate];

    this.getPaymentOutReportData(startDate, endDate);
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
        // Clear the date range selection when a filter is applied

    this.rangeDates = [];
    this.getPaymentOutReportData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, "0");
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
