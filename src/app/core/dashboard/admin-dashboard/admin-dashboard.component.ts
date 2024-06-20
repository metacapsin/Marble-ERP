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

  constructor(
    // public data: DataService,
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
    const startDate = new Date();
    const endDate = new Date();

    // Set the start date to one month ago
    startDate.setMonth(startDate.getMonth() - 1);
    var Sdate = this.formatDate(startDate)
    var Edate = this.formatDate(endDate)

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
      this.apiCall(formattedDate1,formattedDate2);
    }
  }
  apiCall(startDate,endDate): void {
    const data = {
      startDate:startDate,
      endDate: endDate
    }
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
        this.CategorySlabs = resp.data
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
        this.allSlabsDaTa = resp.data
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
    const totalPaymentReceivedData = data.map(
      (item) => item.totalPaymentReceived
    );
    const totalPaymentSentData = data.map((item) => item.totalPaymentSent);
    console.log(totalPaymentReceivedData, totalPaymentSentData);

    this.dataForSecondChat = {
      labels: [
        "Total Sales",
        "Total Expenses",
        "Payment Sent",
        "Payment Received",
        "Total Payment Due",
      ],
      datasets: [
        {
          data: totalPaymentReceivedData,
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
  }

  
}
