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
  public chartOptionsOne: Partial<ChartOptions>;
  public chartOptionsTwo: Partial<ChartOptions>;
  public chartOptionsThree: Partial<ChartOptions>;
  // public recentPatients: Array<recentPatients> = [];
  // public upcomingAppointments: Array<upcomingAppointments> = [];
  userData: any = {};
  dataForFirstChat: any;
  optionsForFirstChat: any;
  dataForSecondChat: any;
  optionsForSecondChat: any;
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
  allSlabsDaTa: { _id: string; slabNo: string; slabName: string; slabSize: string; categoryDetail: { name: string; }; subCategoryDetail: { name: string; }; totalSQFT: number; totalCosting: number; sellingPricePerSQFT: number; warehouseDetails: { name: string; }; isInUse: boolean; }[];

  constructor(
    // public data: DataService,
    private Service: dashboardService,
    private crypto: AESEncryptDecryptService
  ) {
    this.chartOptionsOne = {
      chart: {
        height: 230,
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "15%",
        },
      },
      stroke: {
        show: true,
        width: 6,
        colors: ["transparent"],
      },
      dataLabels: {
        enabled: false,
      },
      series: [
        {
          name: "Low",
          color: "#D5D7ED",
          data: [20, 30, 41, 67, 22, 43, 40, 10, 30, 20, 40],
        },
        {
          name: "High",
          color: "#2E37A4",
          data: [13, 23, 20, 8, 13, 27, 30, 25, 10, 15, 20],
        },
      ],
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisBorder: {
          show: false, // set to false to hide the vertical gridlines
        },
      },
    };
    this.chartOptionsTwo = {
      series: [44, 55, 41, 17],
      chart: {
        type: "donut",
        height: 200,
        width: 200,
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
        },
      },

      dataLabels: {
        enabled: false,
      },
      labels: ["Male", "Female"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
    // this.recentPatients = this.data.recentPatients;
    // this.upcomingAppointments = this.data.upcomingAppointments;
    this.userData = this.crypto.getData("currentUser");
  }
  ngOnInit(): void {
    // this.Service.DashboardController().subscribe((resp: any) => {
    //   this.wareHousedata = resp.data;
    // })

    // color for  first chat
    this.dataForFirstChat = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "#ec4899",
          borderColor: "#ec4899",
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: "My Second dataset",
          backgroundColor: "#3b82f6",
          borderColor: "#3b82f6",
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };
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

    // color for  second chat
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
          data: [540, 325, 702, 430, 300],
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

    // table JSON
    // Sample JSON data structure
    this.allSlabsDaTa = [
      {
        _id: "1",
        slabNo: "001",
        slabName: "Slab 1",
        slabSize: "10x10",
        categoryDetail: { name: "Category A" },
        subCategoryDetail: { name: "Subcategory X" },
        totalSQFT: 100,
        totalCosting: 5000,
        sellingPricePerSQFT: 50,
        warehouseDetails: { name: "Warehouse 1" },
        isInUse: false,
      },
      {
        _id: "2",
        slabNo: "002",
        slabName: "Slab 2",
        slabSize: "8x8",
        categoryDetail: { name: "Category B" },
        subCategoryDetail: { name: "Subcategory Y" },
        totalSQFT: 64,
        totalCosting: 3200,
        sellingPricePerSQFT: 55,
        warehouseDetails: { name: "Warehouse 2" },
        isInUse: true,
      },
      // Add more objects as needed
    ];
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
