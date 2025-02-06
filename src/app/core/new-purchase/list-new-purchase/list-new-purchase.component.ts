import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { routes } from "src/app/shared/routes/routes";
import { MessageService } from "primeng/api";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { NewPurchaseService } from "../new-purchase.service";
import { SlabsService } from "../../Product/slabs/slabs.service";
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { Router } from "@angular/router";
import { dashboardService } from "../../dashboard/dashboard.service";

@Component({
  selector: "app-list-new-purchase",
  standalone: true,
  imports: [SharedModule, InvoiceDialogComponent],
  templateUrl: "./list-new-purchase.component.html",
  styleUrl: "./list-new-purchase.component.scss",
  providers: [MessageService],
})
export class ListNewPurchaseComponent implements OnChanges {
  public routes = routes;
  searchDataValue: any;
  originalData: any;
  purchaseData: any;
  purchase: any;
  showDialoge: any;
  modalData: any;
  PurchaseListData: any;
  addTaxTotal: any;
  setDataInPopPu: any;
  purchaseId: any;
  blockDetailsTable: any;
  header = "";
  showInvoiceDialog: boolean = false;
  paymentDataListById: any[] = [];
  visible: any;
  purchaseTotalValues: any = {};
  currentUrl: string;
  cols = [];
  exportColumns = [];
  showDataLoader: boolean = false;
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
  searchBy: string = "This Year";
  rangeDates: Date[] | undefined;

  CustomerList = [
    { customerName: "Adnan" },
    { customerName: "Nadim" },
    { customerName: "Kavya" },
  ];

  constructor(
    private Service: NewPurchaseService,
    private datefilter : dashboardService,
    private paymentOutService: PaymentOutService,
    private router: Router,
    private messageService: MessageService,
    private SlabsService: SlabsService,
    private localStorageService: LocalStorageService
  ) { }
  ngOnInit() {
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

      this.getPurchase(startDate, endDate);
    });

    this.currentUrl = this.router.url;
    console.log(this.currentUrl);
    console.log("this is current url on purchase page", this.currentUrl);
    this.localStorageService.removeItem("supplier");
    this.localStorageService.removeItem("returnUrl");

    this.showDataLoader = true;
    // this.onSearchByChange(this.searchBy);
  }
  getPurchase(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.Service.getPurchaseList(data).subscribe((resp: any) => {
      if (resp) {
        this.purchaseTotalValues = resp;
        this.purchaseData = resp.data;
        this.exportCSV();
        this.showDataLoader = false;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.exportCSV();
  }
  // isDeletable(purchase: any): boolean {
  //   return purchase.paymentStatus === 'Unpaid' && 
  //          purchase?.lotDetails?.blockDetails?.every(block => block?.isProcessed===false);
  // }

  // isEditable(purchase: any): boolean {
  //   return purchase.paymentStatus === 'Unpaid' && 
  //          purchase?.lotDetails?.blockDetails?.every(block => block?.isProcessed === false);
  // }
  exportCSV() {
    console.log('purchaseData', this.purchaseData);
    
    this.cols = [
      { field: "purchaseInvoiceNumber", header: "Purchase Invoice Number" },
      { field: "purchaseDate", header: "Purchase Date" },
      { field: "supplier.name", header: "Supplier Name" },
      { field: "purchaseType", header: "Purchase Type" },
      { field: "paymentStatus", header: "Payment Status" },
      { field: "paidAmount", header: "Paid Amount" },
      { field: "dueAmount", header: "Due Amount" },
      { field: "purchaseCost", header: "Purchase Cost" },
      { field: "purchaseNotes", header: "Purchase Notes" },
      { field: "purchaseTotalAmount", header: "Purchase Total Amount" },
      { field: "createdOn", header: "Created On" },
    ];
    if (!this.purchaseData || this.purchaseData.length === 0) {
      this.exportColumns = [{ title: "No purchase records found." }];
    } else {
      this.exportColumns = this.purchaseData.map((element) => ({
        title: element.header,
        dataKey: element.field,
      }));
    }
  }
  navigateToEditPurchase(id: number) {
    this.router.navigate(["/new-purchase/edit-new-purchase/" + id]);
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);

  }

  navigateToCreatePurchase() {
    const returnUrl = this.router.url;
    this.router.navigate(["/new-purchase/add-new-purchase"]);
    this.localStorageService.setItem("returnUrl", returnUrl);
  }

  showInvoiceDialoge(id: any) {
    console.log("id pass to invoice dialoge", id);
    console.log("showInvoiceDialoge is triggered ");
    this.Service.getPurchaseById(id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.PurchaseListData = [resp.data];
      this.header = "Purchase Invoice";

      if (resp.data.lotDetail) {
        this.SlabsService.getBlockDetailByLotId(
          resp.data.lotDetails._id
        ).subscribe((resp: any) => {
          this.blockDetailsTable = resp.data.blockDetails;
        });
      }
    });
    this.paymentOutService
      .getPurchasePaymentListByPurchaseId(id)
      .subscribe((resp: any) => {
        this.paymentDataListById = resp.data;
        console.log("this is payment by Purchase id", this.paymentDataListById);
        console.log("this is payment data on inovice by id", resp.data);
      });
  }

  purchaseDelete(id: number) {
    this.purchase = id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Purchase",
    };
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.deletePurchase(this.purchase).subscribe((resp: any) => {
      this.showInvoiceDialog = false;
      this.showDialoge = false;
      let message = resp.message;
      this.messageService.add({ severity: "success", detail: message });
      this.onSearchByChange(this.searchBy);

    });
  }
  close() {
    this.showInvoiceDialog = false;
    this.showDialoge = false;
  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.getPurchase(startDate, endDate);
    let payload = {
      endDate: endDate,
      startDate: startDate,
    };

    this.datefilter.updAtedateRange(payload).subscribe((resp) => {
      console.log("updt date resp", resp);
    });
  }

  onSearchByChange(event: any) {
    const today = new Date();
    let startDate,
      endDate = today;
      switch (event) {
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
   
    this.getPurchase(startDate, endDate);
   
    let payload = {
      filterby: event,
      endDate: endDate,
      startDate: startDate,
    };

    this.datefilter.updAtedateRange(payload).subscribe((resp) => {
      console.log("updt date resp", resp);
    });
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
