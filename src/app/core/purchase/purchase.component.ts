import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { DataService } from "src/app/shared/data/data.service";
import {
  pageSelection,
  apiResultFormat,
  allInvoice,
} from "src/app/shared/models/models";
import { routes } from "src/app/shared/routes/routes";
import { PurchaseService } from "./purchase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { SlabsService } from "../Product/slabs/slabs.service";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { PaymentOutService } from "../payment-out/payment-out.service";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-purchase",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    InvoiceDialogComponent,
    TabViewModule,
  ],
  templateUrl: "./purchase.component.html",
  styleUrl: "./purchase.component.scss",
  providers: [MessageService],
})
export class PurchaseComponent {
  public routes = routes;
  public checkboxes: string[] = [];

  public allInvoice: Array<allInvoice> = [];
  dataSource!: MatTableDataSource<allInvoice>;
  selectedPurchase:''
  public showFilter = false;
  public searchDataValue = "";
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  originalData: any;
  purchaseData: any;
  purchase: any;
  showDialoge: any;
  modalData: any;
  PurchaseListData: any;
  // visible: boolean = false;
  addTaxTotal: any;
  setDataInPopPu: any;
  purchaseId: any;
  blockDetailsTable: any;
  header = "";
  showInvoiceDialog: boolean = false; 
  paymentDataListById: any[] = [];
  visible:any
  purchaseTotalValues: any = {};
  currentUrl: string;


  CustomerList = [
    { customerName: "Adnan" },
    { customerName: "Nadim" },
    { customerName: "Kavya" },
  ];

  constructor(
    public data: DataService,
    private Service: PurchaseService,
    private paymentOutService: PaymentOutService,
    private router: Router,
    private messageService: MessageService,
    private service: SlabsService,
    private localStorageService:LocalStorageService
  ) {}
  ngOnInit() {
    this.getPurchase();
    this.currentUrl = this.router.url;
    console.log(this.currentUrl)
    console.log("this is current url on purchase page",this.currentUrl)

    this.localStorageService.removeItem('supplier');
    this.localStorageService.removeItem('returnUrl');


  }
  getPurchase() {
    this.Service.GetPurchaseData().subscribe((data: any) => {
      this.purchaseTotalValues = data;
      this.purchaseData = data.data;
      this.originalData = data;
    });
  }
  blocksEdit(id: any) {
    console.log(id);
  }
  purchaseUpdate(id: number) {
    this.router.navigate(["/purchase/edit-purchase/" + id]);
  }

  navigateToCreatePurchase() {
    const returnUrl = this.router.url;
    this.router.navigate(['/purchase/add-purchase']);
    this.localStorageService.setItem('returnUrl',returnUrl);

    // this.router.navigate(['/purchase/add-purchase'], { state: { returnUrl: this.currentUrl } });
  }

  showInvoiceDialoge(id: any)  {
    let totalTax = 0;
    console.log("id pass to invoice dialoge", id);
    console.log("showInvoiceDialoge is triggered ");
    this.Service.GetPurchaseDataById(id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.PurchaseListData = [resp.data];
      this.header = "Purchase Invoice";
      console.log(this.PurchaseListData[0].lotDetails);
      console.log(this.PurchaseListData);
      console.log(resp);


      if (resp.data.lotDetails) {
        this.service
          .getBlockDetailByLotId(resp.data.lotDetails._id)
          .subscribe((resp: any) => {
            this.blockDetailsTable = resp.data.blockDetails;
          });
      }
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
  // showNewDialog() {
    // }
    callBackModal() {
      this.Service.DeletePurchaseData(this.purchase).subscribe((resp: any) => {
        this.showInvoiceDialog = false;
        this.showDialoge = false;
      let message = "Purchase has been Deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getPurchase();
    });
  }
  close() {
    // this.visible = false;
    this.showInvoiceDialog = false;
      this.showDialoge = false;
    
  }
  
}
