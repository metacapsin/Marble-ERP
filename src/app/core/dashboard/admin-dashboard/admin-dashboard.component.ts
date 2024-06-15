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
  // public chartOptionsOne: Partial<ChartOptions>;
  // public chartOptionsTwo: Partial<ChartOptions>;
  // public chartOptionsThree: Partial<ChartOptions>;
  maxDate = new Date();
  rangeDates: any;
  // public recentPatients: Array<recentPatients> = [];
  // public upcomingAppointments: Array<upcomingAppointments> = [];
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

  constructor(
    // public data: DataService,
    private Service: dashboardService,
    private crypto: AESEncryptDecryptService
  ) {
    // this.chartOptionsOne = {
    //   chart: {
    //     height: 230,
    //     type: "bar",
    //     stacked: true,
    //     toolbar: {
    //       show: false,
    //     },
    //   },
    //   grid: {
    //     show: true,
    //     xaxis: {
    //       lines: {
    //         show: false,
    //       },
    //     },
    //     yaxis: {
    //       lines: {
    //         show: true,
    //       },
    //     },
    //   },
    //   responsive: [
    //     {
    //       breakpoint: 480,
    //       options: {
    //         legend: {
    //           position: "bottom",
    //           offsetX: -10,
    //           offsetY: 0,
    //         },
    //       },
    //     },
    //   ],
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: "15%",
    //     },
    //   },
    //   stroke: {
    //     show: true,
    //     width: 6,
    //     colors: ["transparent"],
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   series: [
    //     {
    //       name: "Low",
    //       color: "#D5D7ED",
    //       data: [20, 30, 41, 67, 22, 43, 40, 10, 30, 20, 40],
    //     },
    //     {
    //       name: "High",
    //       color: "#2E37A4",
    //       data: [13, 23, 20, 8, 13, 27, 30, 25, 10, 15, 20],
    //     },
    //   ],
    //   xaxis: {
    //     categories: [
    //       "Jan",
    //       "Feb",
    //       "Mar",
    //       "Apr",
    //       "May",
    //       "Jun",
    //       "Jul",
    //       "Aug",
    //       "Sep",
    //       "Oct",
    //       "Nov",
    //       "Dec",
    //     ],
    //     axisBorder: {
    //       show: false, // set to false to hide the vertical gridlines
    //     },
    //   },
    // };
    // this.chartOptionsTwo = {
    //   series: [44, 55, 41, 17],
    //   chart: {
    //     type: "donut",
    //     height: 200,
    //     width: 200,
    //     toolbar: {
    //       show: false,
    //     },
    //   },
    //   legend: {
    //     show: false,
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: "50%",
    //     },
    //   },

    //   dataLabels: {
    //     enabled: false,
    //   },
    //   labels: ["Male", "Female"],
    //   responsive: [
    //     {
    //       breakpoint: 480,
    //       options: {
    //         chart: {
    //           width: 200,
    //         },
    //         legend: {
    //           position: "bottom",
    //         },
    //       },
    //     },
    //   ],
    // };
    // this.recentPatients = this.data.recentPatients;
    // this.upcomingAppointments = this.data.upcomingAppointments;
    this.userData = this.crypto.getData("currentUser");
  }
  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, "0");
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }

  cardList: any = [
    {
      cardHeading: "Total Sales",
      numValueOne: "56",
      numValueTwo: "60%",
    },
    {
      cardHeading: "Total Expenses",
      numValueOne: "45",
      numValueTwo: "98%",
    },
    {
      cardHeading: "Payment Sent",
      numValueOne: "12",
      numValueTwo: "78%",
    },
    {
      cardHeading: "Payment Received",
      numValueOne: "32",
      numValueTwo: "71%",
    },
    {
      cardHeading: "Total Payment Due",
      numValueOne: "23",
      numValueTwo: "01%",
    },
  ];
  ngOnInit(): void {
    this.maxDate = new Date();
    const startDate = new Date();
    const endDate = new Date();

    // Set the start date to one month ago
    startDate.setMonth(startDate.getMonth() - 1);

    this.rangeDates = [startDate, endDate];

    // Initial API call
    this.apiCall();

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

      console.log(formattedDate1); // Output: 02/06/2024 - 00:00
      console.log(formattedDate2); // Output: 05/06/2024 - 00:00
      this.rangeDates = [formattedDate1, formattedDate2];
      // Call the API when the date range changes
      this.apiCall();
    }
  }
  apiCall(): void {
    this.Service.getFinancialSummary(this.rangeDates).subscribe(
      (resp: any) => {
        console.log(resp.data);
        this.financialSummaryData = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getMonthlySalesPurchasesAndCharts(this.rangeDates).subscribe(
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
    this.Service.getStockSummary(this.rangeDates).subscribe(
      (resp: any) => {
        console.log(resp);
        // this.financialSummaryData = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getStockAlert(this.rangeDates).subscribe(
      (resp: any) => {
        console.log(resp.data);
        // this.financialSummaryData = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getTopCustomers(this.rangeDates).subscribe(
      (resp: any) => {
        console.log(resp);
        this.allSlabsDaTa = resp.data
        // this.financialSummaryData = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getPaymentSentRecivedByMonth(this.rangeDates).subscribe(
      (resp: any) => {
        console.log(resp);
        // this.financialSummaryData = resp.data;
        this.setDataForSecondChart(resp.barChartData);
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
          data: [totalPaymentSentData,10,255,totalPaymentReceivedData],
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

  // public sortData(sort: Sort) {
  //   const data = this.recentPatients.slice();
  //   const datas = this.upcomingAppointments.slice();

  //   if (!sort.active || sort.direction === "") {
  //     this.recentPatients = data;
  //     this.upcomingAppointments = datas;
  //   } else {
  //     this.recentPatients = data.sort((a, b) => {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const aValue = (a as any)[sort.active];
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const bValue = (b as any)[sort.active];
  //       return (aValue < bValue ? -1 : 1) * (sort.direction === "asc" ? 1 : -1);
  //     });
  //     this.upcomingAppointments = datas.sort((a, b) => {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const aValue = (a as any)[sort.active];
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const bValue = (b as any)[sort.active];
  //       return (aValue < bValue ? -1 : 1) * (sort.direction === "asc" ? 1 : -1);
  //     });
  //   }
  // }
  selecedList: data[] = [
    { value: "2022" },
    { value: "2021" },
    { value: "2020" },
    { value: "2019" },
  ];
  selecedLists: data[] = [
    { value: "This Week" },
    { value: "Last Week" },
    { value: "This Month" },
    { value: "Last Month" },
  ];
}
