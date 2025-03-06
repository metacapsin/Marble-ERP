import { Component, ViewChild } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { RatingModule } from "primeng/rating";

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
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ProfitLossModule } from "../../reports/reports/profit-loss-reports/profit-loss-reports.module";
import { ReportsService } from "../../reports/reports/reports.service";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
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

interface Product {
  id: string;
  name: string;
  phoneNo: number;
  expanded?: boolean; // Add this property to track the expanded state
  creditAlerts: CreditAlert[];
}

interface CreditAlert {
  id: number;
  // customer: string;
  saleId: string;
  salesDate: string;
  customer: {
    name: string;
    phoneNo: number;
    email: string;
  };
  salesTotalAmount: string;
  dueAmount: string;
  paidAmount: string;
  creditPeriod: number;
  daysLeft: number;
  alertType: string;
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
  financialSummaryDataForPayment: any;
  barChartData: any;
  CategorySlabs: any;
  rangeDatesForAip: any[];
  stockAlertData: any;
  piDataForFirstChat: {
    labels: string[];
    datasets: {
      data: any;
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  };
  piDataForSecondChat: {
    labels: any;
    datasets: {
      data: any;
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  };
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

  expandedRows: { [key: string]: boolean } = {};
  products: Product[] = [];
  totalCategorySlabs: any;
  totalSubCategorySlabs: any;
  data: any;
  stateCategory: any[] = [
    { label: "Graph", value: "graph" },
    { label: "Table", value: "table" },
  ];
  valueCategory: string = "graph";

  stateSubCategory: any[] = [
    { label: "Graph", value: "graph" },
    { label: "Table", value: "table" },
  ];
  valueSubCategory: string = "graph";
  orgCategorySlabs: any;
  orgSubCategorySlabs: any[];
  categorySearchDataValue: any;
  subCategorySearchDataValue: any;
  stockAlertSearchDataValue: any;
  StockWarehouseWiseLot: any;
  StockWarehouseWiseSlab: any;
  StockWarehouseWise: any;
  wareHousedataListsEditArray: any[];
  visible: boolean = false;
  chartType: string = "";
  subCategoryslabsData: any[];

  constructor(
    // public data: DataService,
    private router: Router,
    private Service: dashboardService,
    private reportsService: ReportsService,
    private crypto: AESEncryptDecryptService,
    private service: WarehouseService
  ) {
    this.userData = this.crypto.getData("currentUser");
    console.log(this.userData);
  }
  formatDate(date: Date): string {
    const month = (date?.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date?.getDate().toString().padStart(2, "0");
    const year = date?.getFullYear();
    return `${month}/${day}/${year}`;
  }

  ngOnInit(): void {
    this.getwareHouse();
    this.maxDate = new Date();

    let startDate: Date;
    let endDate: Date;
    this.Service.getUpdatedTime().subscribe((resp: any) => {
      if (resp?.status === 'success') {
        let dates = resp.data;
        if (dates.startUtc && dates.endUtc) {
          this.data = dates.filterby;
          if(dates.filterby){
            let startEndDate = this.getDateByPrefrence(dates.filterby);
            startDate = startEndDate[0];
            endDate = startEndDate[1];
          } else{
            startDate = new Date(dates.startUtc);
            endDate = new Date(dates.endUtc);
          }
        } else {
          this.data = "This Year";
          startDate = new Date(new Date().getFullYear(), 0, 1);
          endDate = new Date();
        }
        const Sdate = this.formatDate(startDate);
        const Edate = this.formatDate(endDate);
        
        this.rangeDates = [startDate, endDate];
        if(this.data){
          this.onSearchByChange({value: this.data});

        }
       
        this.apiCall(Sdate, Edate);
      } else {
        if(resp?.message === 'No preference found for the given user.'){
        this.data = "This Year";
        this.onSearchByChange({value: 'This Year'})
        }
      }
    });

    this.optionsForFirstChat = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: "#000000",
          },
          position: "bottom",
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#666617a2b866",
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

  toggleRow(product: Product) {
    product.expanded = !product.expanded;
  }

  getSeverity(alertType: string) {
    switch (alertType) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "success";
    }
  }

  getwareHouse() {
    this.service.getAllWarehouseList().subscribe((resp: any) => {
      if (resp.status === "success") {
        this.wareHousedataListsEditArray = resp.data;
      }
    });
  }

  filterdatabywarehoue(event: any) {
    console.log("event", event);
  }

  getStatusSeverity(daysLeft: number) {
    // console.log("credit alerts days left", daysLeft);
    if (daysLeft <= 0) {
      return "danger";
    } else if (daysLeft > 0 && daysLeft <= 5) {
      return "warning";
    } else if (daysLeft > 5 && daysLeft <= 10) {
      return "info";
    } else {
      return "success";
    }
  }
  getDateOnChange(): void {
    console.log("object");
    console.log(this.rangeDates);
    localStorage.setItem("lastSelectDate", this.rangeDates);
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

      let payload = {
        endDate: formattedDate2,
        startDate: formattedDate1,
      };

      this.Service.updAtedateRange(payload).subscribe((resp) => {
        console.log("updt date resp", resp);
      });


    }
  }
  apiCall(startDate, endDate): void {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    console.log(data);
    this.reportsService.getProfitLoss(data).subscribe(
      (resp: any) => {
        console.log(resp.data);
        this.financialSummaryData = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getFinancialSummary(data).subscribe(
      (resp: any) => {
        console.log(resp.data);
        this.financialSummaryDataForPayment = resp.data;
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getMonthlySalesPurchasesAndCharts(data).subscribe(
      (resp: any) => {
        console.log(resp);
        this.barChartData = resp.barChartData;
        console.log("Monthly Bar Chart Data ", this.barChartData);
        this.setDataForChart(resp.barChartData);
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
        console.log(this.stockAlertData);
      },
      (error: any) => {
        console.error("Error fetching financial summary:", error);
      }
    );
    this.Service.getCustomerCreditAlerts(data).subscribe(
      (resp: any) => {
        console.log("customer credit alerts summary", resp.data);
        this.products = resp.data;
      },
      (error: any) => {
        console.error("Error fetching customer Credit Alerts summary:", error);
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
    // this.Service.getPaymentSentRecivedByMonth(data).subscribe(
    //   (resp: any) => {
    //     console.log(resp);
    //     // this.financialSummaryData = resp.data;
    //     this.setDataForSecondChart(resp.barChartData);
    //   },
    //   (error: any) => {
    //     console.error("getPaymentSentRecivedByMonth:", error);
    //   }
    // );
    this.Service.getRecentSales(data).subscribe(
      (resp: any) => {
        console.log(resp);
        // this.financialSummaryData = resp.data;
        // this.setDataForSecondChart(resp.barChartData);
      },
      (error: any) => {
        console.error("getRecentSales:", error);
      }
    );
    this.Service.getStockWarehouseWise().subscribe(
      (resp: any) => {
        console.log(resp);
        this.StockWarehouseWise = resp;
        // this.StockWarehouseWiseSlab = resp.slab
        console.log(this.StockWarehouseWise);
      },
      (error: any) => {
        console.error("Stock Warehouse Wise:", error);
      }
    );
  }

  setDataForChart(data: any[]): void {
    if (!data || !Array.isArray(data)) {
      // console.error("Invalid data format:", data);
      return;
    }
    console.log(data);
    const labels = data.map((item) => item.monthName);
    const totalSalesData = data.map((item) => item.totalSales);
    const totalSalesReturnData = data.map((item) => item.totalSalesReturn);
    const totalSalesReturnPaymentDueData = data.map(
      (item) => item.totalSalesReturnPaymentDue
    );
    const totalSalesPaymentDueData = data.map(
      (item) => item.totalSalesPaymentDue
    );
    const totalPurchaseData = data.map((item) => item.totalPurchases);
    const totalPurchaseReturnData = data.map(
      (item) => item.totalPurchaseReturn
    );
    const totalPurchaseReturnPaymentDueData = data.map(
      (item) => item.totalPurchaseReturnPaymentDue
    );
    const totalPurchasePaymentDueData = data.map(
      (item) => item.totalPurchasePaymentDue
    );
    console.log(
      totalSalesPaymentDueData,
      totalSalesReturnPaymentDueData,
      totalSalesReturnData,
      totalSalesData,
      totalPurchasePaymentDueData,
      totalPurchaseReturnPaymentDueData,
      totalPurchaseReturnData,
      totalPurchaseData
    );

    console.log(labels, totalSalesData, totalSalesReturnData);
    this.dataForFirstChat = {
      labels: labels,
      datasets: [
        {
          label: "Sales",
          backgroundColor: "#28a745",
          borderColor: "#28a745",
          data: totalSalesData,
        },
        {
          label: "Sales Return",
          backgroundColor: "#ffc107",
          borderColor: "#ffc107",
          data: totalSalesReturnData,
        },
        // {
        //   label: "Total Sales Payment Due",
        //   backgroundColor: "#ff9f40",
        //   borderColor: "#ff9f40",
        //   data: totalSalesPaymentDueData,
        // },
        // {
        //   label: "Total Sales Return Payment Due",
        //   backgroundColor: "#9966ff",
        //   borderColor: "#9966ff",
        //   data: totalSalesReturnPaymentDueData,
        // },
      ],
    };
    this.dataForSecondChat = {
      labels: labels,
      datasets: [
        {
          label: "Purchase",
          backgroundColor: "#28a745",
          borderColor: "#28a745",
          data: totalPurchaseData,
        },
        {
          label: "Purchase Return",
          backgroundColor: "#ffc107",
          borderColor: "#ffc107",
          data: totalPurchaseReturnData,
        },
        // {
        //   label: "Total Purchase Payment Due",
        //   backgroundColor: "#ff9f40",
        //   borderColor: "#ff9f40",
        //   data: totalPurchasePaymentDueData,
        // },
        // {
        //   label: "Total Purchase Return Payment Due",
        //   backgroundColor: "#9966ff",
        //   borderColor: "#9966ff",
        //   data: totalPurchaseReturnPaymentDueData,
        // },
      ],
    };
  }
  // setDataForSecondChart(data: any[]): void {
  //   console.log(data);
  //   const yearArray = data.map((item) => item.monthName);
  //   const totalPaymentReceivedData = data.map(
  //     (item) => item.totalPaymentReceived
  //   );
  //   const totalPaymentSentData = data.map((item) => item.totalPaymentSent);
  //   console.log(totalPaymentReceivedData, totalPaymentSentData);
  //   this.dataForSecondChat = {
  //     labels: yearArray,
  //     datasets: [
  //       {
  //         label: "Payment Sent",
  //         backgroundColor: "#ef4444",
  //         borderColor: "#ef4444",
  //         data: totalPaymentSentData,
  //       },
  //       {
  //         label: "Payment Received",
  //         backgroundColor: "#22c55e",
  //         borderColor: "#22c55e",
  //         data: totalPaymentReceivedData,
  //       },
  //       // {
  //       //   label: "Total Sales Payment Due",
  //       //   backgroundColor: "#ff9f40",
  //       //   borderColor: "#ff9f40",
  //       //   data: totalSalesPaymentDueData,
  //       // },
  //       // {
  //       //   label: "Total Purchase Payment Due",
  //       //   backgroundColor: "#9966ff",
  //       //   borderColor: "#9966ff",
  //       //   data: totalPurchasePaymentDueData,
  //       // },
  //     ],
  //   };
  // }
  categoryForDrpdownChange(value) {
    console.log("value", value);
    this.subCategoryslabsData = [];
    if (value == null) {
      console.log("null");
      this.subCategoryslabsData = this.orgSubCategorySlabs;
    } else {
      this.subCategoryslabsData = this.orgSubCategorySlabs.filter(
        (element) => element.categoryName === value.name
      );
      console.log(this.subCategoryslabsData);
    }
    this.piDataForSecondChat = {
      labels: this.subCategoryslabsData.map((element) => element.name), // Array of names
      datasets: [
        {
          data: this.subCategoryslabsData.map((element) => element.totalSQFT), // Array of totalSQFT values
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
  categoryChart(data) {
    console.log(data);
    this.orgCategorySlabs = data.totalCategorySlabs;
    this.orgSubCategorySlabs = data.totalSubCategorySlabs;
    this.subCategoryslabsData = data.totalSubCategorySlabs;
    console.log(this.orgCategorySlabs, this.orgSubCategorySlabs);
    this.totalCategorySlabs = data.totalCategorySlabs.map(
      (item) => item.totalSQFT
    );
    this.totalSubCategorySlabs = this.orgSubCategorySlabs.map(
      (item) => item.totalSQFT
    );
    const totalCategorySlabsLable = data.totalCategorySlabs.map(
      (item) => item.name
    );
    const totalSubCategorySlabsLable = this.orgSubCategorySlabs.map(
      (item) => item.name
    );

    this.piDataForFirstChat = {
      labels: totalCategorySlabsLable,
      datasets: [
        {
          data: this.totalCategorySlabs,
          backgroundColor: [
            "#D8C3A5",
            "#4B4E53",
            "#C4975D",
            "#9AA5A7",
            "#C8B796",
          ],
          hoverBackgroundColor: [
            "#D8C3A5",
            "#4B4E53",
            "#C4975D",
            "#9AA5A7",
            "#C8B796",
          ],
        },
      ],
    };
    this.piDataForSecondChat = {
      labels: totalSubCategorySlabsLable,
      datasets: [
        {
          data: this.totalSubCategorySlabs,
          backgroundColor: [
            "#D8C3A5", // Italian Marble
            "#4B4E53", // Granite
            "#C4975D", // Onyx
            "#9AA5A7", // Quartzite
            "#C8B796", // Travertine
            "#556470", // Slate
            "#E8DED3", // Limestone
            "#1F2124", // Basalt
            "#D4B483", // Marfil
            "#C3A785", // Sandstone
          ],
          hoverBackgroundColor: [
            "#D8C3A5",
            "#4B4E53",
            "#C4975D",
            "#9AA5A7",
            "#C8B796",
            "#556470",
            "#E8DED3",
            "#1F2124",
            "#D4B483",
            "#C3A785",
          ],
        },
      ],
    };
  }
  showDialogForChart(type: string) {
    this.chartType = type;
    this.visible = true;
  }

  navigator(value: string) {
    if (value == "sales") {
      this.router.navigate(["/sales"]);
    }
    if (value == "sales_return") {
      this.router.navigate(["/sales-return"]);
    }
    if (value == "purchase") {
      this.router.navigate(["/new-purchase"]);
    }
    if (value == "purchase_return") {
      this.router.navigate(["/purchase-return"]);
    }
    if (value == "Customer") {
      this.router.navigate(["/customers"]);
    }
    if (value == "Stock_Alert") {
      this.router.navigate(["/slabs"]);
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
      console.log("Start Date:", formattedDate1, "End Date:", formattedDate2);
      this.apiCall(formattedDate1, formattedDate2);

      let payload = {
        filterby: value,
        endDate: formattedDate2,
        startDate: formattedDate1,
      };

      this.Service.updAtedateRange(payload).subscribe((resp) => {
        console.log("updt date resp", resp);
      });
    }
  }

  getDateByPrefrence(value) {
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

    return [startDate, endDate];

   
  }
}
