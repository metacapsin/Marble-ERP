import { Component, OnInit } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { routes } from "src/app/shared/routes/routes";
import { QuotationsService } from "../quotations.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: 'app-list-quotations',
  templateUrl: './list-quotations.component.html',
  styleUrl: './list-quotations.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    InvoiceDialogComponent,
  ],
  providers: [MessageService],
})
export class ListQuotationsComponent implements OnInit {
  public routes = routes;
  public searchDataValue = "";
  paymentListData = [];
  quotationsId: any;
  showDialoge = false;
  modalData: any = {};
  showInvoiceDialog: boolean = false;
  quotationDataById = [];
  quotationListData = [];
  currentUrl: string;
  header: any;
  searchByData = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "This Month",
    "Last 3 Months",
    "Last 6 Months",
    "This Year",
  ];
  searchBy: string = "This Year";
  rangeDates: Date[] | undefined;
  totalAmountValues: any = {}

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private Service: QuotationsService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    // this.GetQuotationsData();
    this.currentUrl = this.router.url;
    console.log("this is current url on sales page", this.currentUrl);
    this.localStorageService.removeItem("customer");
    this.localStorageService.removeItem("returnUrl");
    this.onSearchByChange(this.searchBy)

  }

  deleteQuotations(Id: any) {
    this.quotationsId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Quotations Details",
    };
    this.showDialoge = true;
  }

  editQuotation(id) {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    console.log(
      "this is return url on quotations  page for quotations create",
      returnUrl
    );
    this.router.navigate(["/quotations/edit-quotations/" + id]);
}

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.deleteQuotation(this.quotationsId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.onSearchByChange(this.searchBy)
      this.showDialoge = false;
    });
  }

  navigateToCreateQuotation() {
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);
    console.log(
      "this is return url on quotations  page for quotations create",
      returnUrl
    );
    this.router.navigate(["/quotations/add-quotations"]);
  }

  GetQuotationsData(startDate: Date, endDate: Date) {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    this.Service.getQuotationList(data).subscribe((resp: any) => {
      this.totalAmountValues = resp;
      this.quotationListData = resp.data;
    });
  }


  showInvoiceDialoge(Id: any) {
    this.Service.getQuotationById(Id).subscribe((resp: any) => {
      this.header = "Quotation Invoice";
      this.showInvoiceDialog = true;
      this.quotationDataById = [resp.data];
      console.log("quotation data by id On dialog", this.quotationDataById);
    });
    // this.Service.getSalesPaymentList(Id).subscribe((resp: any) => {
    //   this.paymentListData = resp.data;
    // });
  }

  close() {
    this.showDialoge = false;
    this.showInvoiceDialog = false;
  }

  onDateChange(value: any): void {
    const startDate = value[0];
    const endDate = value[1];
    this.GetQuotationsData(startDate, endDate);
  }

  onSearchByChange(event: any) {
    const today = new Date();
    let startDate,
      endDate = today;
    switch (event) {
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

    this.rangeDates = [startDate, endDate];
    this.GetQuotationsData(startDate, endDate);
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
