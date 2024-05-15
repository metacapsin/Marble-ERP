import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SuppliersdataService } from "../suppliers.service";
import { PurchaseService } from "../../purchase/purchase.service";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { MessageService, SharedModule } from "primeng/api";
import { PurchaseInvoiceDialogComponent } from "src/app/common-component/modals/purchase-invoice-dialog/purchase-invoice-dialog.component";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-view-suppliers",
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, RouterModule, TableModule, CalendarModule, DialogModule, ToastModule, TabViewModule,
    PurchaseInvoiceDialogComponent,
  ],
  providers: [MessageService],
  templateUrl: "./view-suppliers.component.html",
  styleUrl: "./view-suppliers.component.scss",
})
export class ViewSuppliersComponent {
  routes = routes;
  id: any;
  customerData: any;
  paymentListData: any[] = [];
  purchaseDataById: any[] = [];
  modalData: any[]=[];
  purchaseData: any[] = [];
  purchaseId: any;
  showPurchaseInvoiceDialog: boolean = false;
  paymentVisible: boolean = false;

  showDialog: boolean = false;

  showDialoge(){
    this.showDialog=true;
  }

  constructor(
    private Service: SuppliersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentOutService: PaymentOutService,
    private purchaseService: PurchaseService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getSupplier();

    this.PaymentOutService.getPaymentList().subscribe((resp: any) => {
      console.log("payments of customer", resp);

      this.paymentListData = resp.data;
    });
    this.purchaseService.GetPurchaseData().subscribe((resp: any) => {
      console.log("Purchase of Supplier ", resp);

      this.purchaseDataById = resp.data;
      // console.log("sales Data by id ",this.salesDataById);
    });
  }
  getSupplier() {
    this.Service.GetSupplierDataById(this.id).subscribe((data: any) => {
      this.customerData = [data];
      console.log(this.customerData);
    });
  }

  // purchaseInvoiceClose(): void {
  //   this.showPurchaseInvoiceDialog = false;
  // }

  // callBackModal() {
  //   this.purchaseService.DeletePurchaseData(this.id).subscribe((resp: any) => {
  //     this.messageService.add({ severity: "success", detail: resp.message });
  //     this.getSupplier();
  //     this.showDialoge = false;
  //     this.showPurchaseInvoiceDialog = false;
  //   });
  // }
  // close() {
  //   this.showDialoge = false;
  // }

  // // showPurchaseInvoiceDialoge(Id: any) {
  // //   console.log("pass id", Id);

  // //   this.showPurchaseInvoiceDialog = true;

  // //   this.purchaseService.GetPurchaseDataById(Id).subscribe((resp:any) => {
  // //     this.purchaseData = [resp.data];
  // //     console.log("On dialog", this.purchaseDataById);

  // //   })
  // // }

  // openPurchaseInvoiceDialog(Id: any): void {
  //   console.log("pass id", Id);
  //   this.showPurchaseInvoiceDialog = true;

  //   this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
  //     this.purchaseData = [resp.data];
  //     console.log("On dialog", this.purchaseDataById);
  //   });
  // }

  // editPurchaseRout(id) {
  //   this.router.navigate(["/purchase/edit-purchase/" + id]);
  // }

  // showPaymentDialog(Id: any) {
  //   console.log("pass id", Id);

  //   // this.modalData = Id
  //   this.paymentVisible = true;

  //   this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
  //     this.purchaseData = [resp.data];
  //     console.log("On dialog", this.purchaseDataById);
  //   });
  // }
  // deletePurchase(Id: any) {
  //   this.purchaseId = Id;

  //   this.modalData = {
  //     title: "Delete",
  //     messege: "Are you sure you want to delete this Sales Details",
  //   };
  //   this.showDialoge = true;
  // }
  getPurcahse() {
    this.purchaseService.GetPurchaseData().subscribe(
      (resp: any) => {
        console.log("sales of custonmer ", resp);

        this.purchaseDataById = resp.data;
        // console.log("sales Data by id ",this.salesDataById);
      }
    );
  }

  purchaseInvoiceClose(): void {
    this.showPurchaseInvoiceDialog = false;
  }

  callBackModal(): void {
    this.purchaseService.DeletePurchaseData(this.purchaseId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.getPurcahse();
      this.showPurchaseInvoiceDialog = false;
    });
  }

  close(): void {
    this.showPurchaseInvoiceDialog = false;
  }

  openPurchaseInvoiceDialog(Id: any): void {
    this.showPurchaseInvoiceDialog = true;
    this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
      this.purchaseData = [resp.data];
    });
  }

  // deleteSales(Id: any) {
  //   this.purchaseId = Id;

  //   this.modalData = void{
  //     title: "Delete",
  //     messege: "Are you sure you want to delete this Sales Details"
  //   }
  //   this.showDialog = true;
  // }

  // handleModalClose(): void {
  //   this.showDialog = false;
  // }

  // handleModalConfirm(): void {
  //   this.purchaseService.DeletePurchaseData(this.id).subscribe((resp: any) => {
  //     this.messageService.add({ severity: "success", detail: resp.message });
  //     this.getSupplier();
  //     this.showDialog = false;
  //   });
  // }
}
