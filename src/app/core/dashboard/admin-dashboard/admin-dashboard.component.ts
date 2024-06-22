import { Component, ViewChild } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexResponsive,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
} from "ng-apexcharts";
import { Sort } from "@angular/material/sort";
import { DataService } from "src/app/shared/data/data.service";
import { ChartModule } from "primeng/chart";
import {
  recentPatients,
  // upcomingAppointments,
} from "src/app/shared/models/models";
import { AESEncryptDecryptService } from "src/app/shared/auth/AESEncryptDecryptService ";
import { dashboardService } from "../dashboard.service";
import { Router } from "@angular/router";
export type ChartOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  series: ApexAxisChartSeries | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chart: ApexChart | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLabels: ApexDataLabels | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotOptions: ApexPlotOptions | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responsive: ApexResponsive[] | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xaxis: ApexXAxis | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legend: ApexLegend | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fill: ApexFill | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grid: ApexGrid | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stroke: ApexStroke | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: ApexTitleSubtitle | any;
  markers: ApexMarkers | any;
  yaxis: ApexYAxis | any;
};
interface data {
  value: string;
}

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
  
})
export class AdminDashboardComponent {
  public routes = routes;
  public selectedValue!: string;
  @ViewChild("chart") chart!: ChartComponent;
  maxDate = new Date();
  rangeDates: any;
  userData: any = {};
  dataForFirstChat: any;
  optionsForFirstChat: any;
  dataForSecondChat: any;
  optionsForSecondChat: any;
  allSlabsDaTa: {
    _id: string;
    slabNo: string;
    slabName: string;
    slabSize: string;
    categoryDetail: { name: string };
    subCategoryDetail: { name: string };
    totalSQFT: number;
    totalCosting: number;
    sellingPricePerSQFT: number;
    warehouseDetails: { name: string };
    isInUse: boolean;
  }[];
  financialSummaryData: any;
  barChartData: any;
  CategorySlabs: any;
  rangeDatesForAip: any[];
  stockAlertData: any;
  piDataForFirstChat: { labels: string[]; datasets: { data: any; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; };
  piDataForSecondChat: { labels: any; datasets: { data: any; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; };
  searchByData = [
    "Today", "YesterDay", "Last 7 Days", "This Month", "Last 3 Months", "Last 6 Months", "This Year"
  ];
  constructor(
    // public data: DataService,
    private router: Router,
    private Service: dashboardService,
    private crypto: AESEncryptDecryptService
  ) {
    this.userData = this.crypto.getData("currentUser");
  }
  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, "0");
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }

  ngOnInit(): void {
    this.maxDate = new Date();
    const today = new Date();
    // const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1);
    // Set the start date to one month ago
    // startDate.setMonth(startDate.getMonth() - 1);
    var Sdate = this.formatDate(startDate);
    var Edate = this.formatDate(endDate);

    this.rangeDates = [startDate, endDate];
    console.log(this.rangeDates);

    // Initial API call
    this.apiCall(Sdate, Edate);

    this.optionsForFirstChat = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: "#000000",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#666666",
            font: {
              weight: 500,
            },
          },
          grid: {
            color: "#e0e0e0",
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: "#666666",
          },
          grid: {
            color: "#e0e0e0",
            drawBorder: false,
          },
        },
      },
    };
    this.optionsForSecondChat = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: "#000000",
          },
        },
      },
    };
  }
  getDateOnChange(): void {
    console.log("object");
    console.log(this.rangeDates);
    if (!this.rangeDates[0] || !this.rangeDates[1]) {
      console.log("Please enter both start and end dates");
    } else {
      const date1 = new Date(this.rangeDates[0]);
      const date2 = new Date(this.rangeDates[1]);

      const formattedDate1 = this.formatDate(date1);
      const formattedDate2 = this.formatDate(date2);

      console.log(formattedDate1);
      console.log(formattedDate2);
      // Call the API when the date range changes
      this.apiCall(formattedDate1, formattedDate2);
    }
  }
  apiCall(startDate, endDate): void {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    this.Service.getFinancialSummary(data).subscribe(
      (resp: any) => {
        console.log(resp.data);
        this.financialSummaryData = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getMonthlySalesPurchasesAndCharts(data).subscribe(
      (resp: any) => {
        console.log(resp);
        this.barChartData = resp.barChartData;
        console.log(this.barChartData);
        this.setDataForFirstChart(resp.barChartData);
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getStockSummary(data).subscribe(
      (resp: any) => {
        console.log(resp);
        // this.financialSummaryData = resp.data;
        this.CategorySlabs = resp.data;
        this.categoryChart(resp.data);
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getStockAlert(data).subscribe(
      (resp: any) => {
        console.log(resp.data);
        this.stockAlertData = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getTopCustomers(data).subscribe(
      (resp: any) => {
        console.log(resp);
        this.allSlabsDaTa = resp.data;
        // this.financialSummaryData = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getPaymentSentRecivedByMonth(data).subscribe(
      (resp: any) => {
        console.log(resp);
        // this.financialSummaryData = resp.data;
        this.setDataForSecondChart(resp.barChartData);
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getRecentSales(data).subscribe(
      (resp: any) => {
        console.log(resp);
        // this.financialSummaryData = resp.data;
        // this.setDataForSecondChart(resp.barChartData);
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
  }
  setDataForFirstChart(data: any[]): void {
    if (!data || !Array.isArray(data)) {
      // console.error("Invalid data format:", data);
      return;
    }
    const labels = data.map((item) => item.monthName);
    const totalSalesData = data.map((item) => item.totalSales);
    const totalPurchasesData = data.map((item) => item.totalPurchases);
    const totalPurchasePaymentDueData = data.map(
      (item) => item.totalPurchasePaymentDue
    );
    const totalSalesPaymentDueData = data.map(
      (item) => item.totalSalesPaymentDue
    );
    console.log(
      totalSalesPaymentDueData,
      totalPurchasePaymentDueData,
      totalPurchasesData,
      totalSalesData
    );

    this.dataForFirstChat = {
      labels: labels,
      datasets: [
        {
          label: "Total Sales",
          backgroundColor: "#ff6384",
          borderColor: "#ff6384",
          data: totalSalesData,
        },
        {
          label: "Total Purchases",
          backgroundColor: "#36a2eb",
          borderColor: "#36a2eb",
          data: totalPurchasesData,
        },
        {
          label: "Total Sales Payment Due",
          backgroundColor: "#ff9f40",
          borderColor: "#ff9f40",
          data: totalSalesPaymentDueData,
        },
        {
          label: "Total Purchase Payment Due",
          backgroundColor: "#9966ff",
          borderColor: "#9966ff",
          data: totalPurchasePaymentDueData,
        },
      ],
    };
  }
  setDataForSecondChart(data: any[]): void {
    console.log(data);
    const yearArray = data.map((item) => item.monthName);
    const totalPaymentReceivedData = data.map(
      (item) => item.totalPaymentReceived
    );
    const totalPaymentSentData = data.map((item) => item.totalPaymentSent);
    console.log(totalPaymentReceivedData, totalPaymentSentData);
    this.dataForSecondChat = {
      labels: yearArray,
      datasets: [
        {
          label: "Payment Sent",
          backgroundColor: "#ff6384",
          borderColor: "#ff6384",
          data: totalPaymentReceivedData,
        },
        {
          label: "Payment Received",
          backgroundColor: "#36a2eb",
          borderColor: "#36a2eb",
          data: totalPaymentSentData,
        },
        // {
        //   label: "Total Sales Payment Due",
        //   backgroundColor: "#ff9f40",
        //   borderColor: "#ff9f40",
        //   data: totalSalesPaymentDueData,
        // },
        // {
        //   label: "Total Purchase Payment Due",
        //   backgroundColor: "#9966ff",
        //   borderColor: "#9966ff",
        //   data: totalPurchasePaymentDueData,
        // },
      ],
    };
  }
  categoryChart(data) {
    console.log(data);
    const totalCategorySlabs = data.totalCategorySlabs.map(
      (item) => item.totalSQFT
    );
    const totalSubCategorySlabs = data.totalSubCategorySlabs.map(
      (item) => item.totalSQFT
    );
    const totalCategorySlabsLable = data.totalCategorySlabs.map(
      (item) => item.name
    );
    const totalSubCategorySlabsLable = data.totalSubCategorySlabs.map(
      (item) => item.name
    );

    this.piDataForFirstChat = {
      labels: totalCategorySlabsLable,
      datasets: [
        {
          data: totalCategorySlabs,
          backgroundColor: [
            "#3b82f6",
            "#f59e0b",
            "#6ee7b7",
            "#ffc107",
            "#4caf50",
          ],
          hoverBackgroundColor: [
            "#3b82f6",
            "#f59e0b",
            "#6ee7b7",
            "#ffc107",
            "#4caf50",
          ],
        },
      ],
    };
    this.piDataForSecondChat = {
      labels: totalSubCategorySlabsLable,
      datasets: [
        {
          data: totalSubCategorySlabs,
          backgroundColor: [
            "#3b82f6", // Blue
            "#f59e0b", // Orange
            "#6ee7b7", // Teal
            "#ffc107", // Amber
            "#4caf50", // Green
            "#e91e63", // Pink
            "#9c27b0", // Purple
            "#673ab7", // Deep Purple
            "#2196f3", // Light Blue
            "#00bcd4", // Cyan
            "#009688", // Teal
            "#8bc34a", // Light Green
            "#cddc39", // Lime
            "#ff9800", // Orange
            "#ff5722", // Deep Orange
          ],
          hoverBackgroundColor: [
            "#3b82f6", // Blue
            "#f59e0b", // Orange
            "#6ee7b7", // Teal
            "#ffc107", // Amber
            "#4caf50", // Green
            "#e91e63", // Pink
            "#9c27b0", // Purple
            "#673ab7", // Deep Purple
            "#2196f3", // Light Blue
            "#00bcd4", // Cyan
            "#009688", // Teal
            "#8bc34a", // Light Green
            "#cddc39", // Lime
            "#ff9800", // Orange
            "#ff5722", // Deep Orange
          ],
        },
      ],
    };
    
  }

  navigator(value: any) {
    if (value == "sales_purchase") {
      this.router.navigate(["/sales"]);
    }
    if (value == "payment") {
      this.router.navigate(["/reports/payment-in-reports"]);
    }
    if (value == "Customer") {
      this.router.navigate(["/customers"]);
    }
    if(value == "Stock_Alert"){
      this.router.navigate(["/reports/inventory-reports"]);
    }
    // /customers//
  }
  oneCoustomer(id: any) {
    this.router.navigate([`/customers/view-customers/${id}`]);
  }
  onSearchByChange(event: any) {
    console.log(event);
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
    const formattedDate1 = this.formatDate(startDate);
    const formattedDate2 = this.formatDate(endDate);
    this.apiCall(formattedDate1, formattedDate2);
  }
}
