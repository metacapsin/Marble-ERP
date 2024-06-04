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
import { PaymentInService } from "../../payment-in/payment-in.service";
import { PurchaseReturnService } from "../../purchase-return/purchase-return.service";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { PaymentsInvoiceDialogComponent } from "src/app/common-component/modals/payments-invoice-dialog/payments-invoice-dialog.component";

@Component({
  selector: "app-view-suppliers",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    RouterModule,
    TableModule,
    CalendarModule,
    DialogModule,
    ToastModule,
    TabViewModule,
    InvoiceDialogComponent,
    PaymentsInvoiceDialogComponent,
  ],
  providers: [MessageService],
  templateUrl: "./view-suppliers.component.html",
  styleUrl: "./view-suppliers.component.scss",
})
export class ViewSuppliersComponent {
  routes = routes;
  id: any; // to hold supplier id
  supplierDataById: any[] = [];
  purchaseDataShowById: any; // to hold purchase data by supplier id
  purchaseReturnDataShowById: any[] = []; // to hold purchase Return data by supplier id
  paymentListDataBySupplierId: any[] = []; // to hold payment data by Supplier id
  showInvoiceDialog: boolean = false; // to enable purchase invoice popup
  showPaymentDialog: boolean = false; //to payment in inovice popup
  showDialoge: boolean = false; // to enable delete popup
  modalData: any = {}; // to print delete message on delete api
  supplierID: any;
  purchaseId: any;
  paymentDataListById: any[] = [];
  paymentReturnDataListById: any[] = [];
  paymentObject: any = {};
  purchaseTotalDueAmount: number = 0;
  header = "";

  constructor(
    private SupplierService: SuppliersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentOutService: PaymentOutService,
    private PaymentInService: PaymentInService,
    private purchaseService: PurchaseService,
    private purchaseReturnService: PurchaseReturnService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getSuppliers();
    this.getPurchase();
    this.getPaymentListBySupplierId();
    this.getPurchaseReturn();
    this.getPurchaseReturnPaymentListBySupplierId();
  }
  getSuppliers() {
    this.SupplierService.GetSupplierDataById(this.id).subscribe((data: any) => {
      console.log("supplier data by id", data);
      this.supplierID = data._id;
      console.log("supplier id", this.supplierID);
      this.supplierDataById = [data];
    });
  }

  getPurchase() {
    this.purchaseTotalDueAmount = 0;
    this.purchaseService.getAllPurchaseBySupplierId(this.id).subscribe((resp: any) => {
      // console.log("purchase Data response by customer id ", resp);
      this.purchaseDataShowById = resp.data;
      // console.log("purchase Data by customer id ",this.purchaseDataShowById);
      resp.data.forEach((e) => {
        this.purchaseTotalDueAmount += e.dueAmount;
        console.log("this is total due amount of this supplier",e.dueAmount);
      });
    });
  }

  getPaymentListBySupplierId() {
    this.PaymentOutService
    .getPurchasePaymentListBySupplierId(this.id)
    .subscribe((resp: any) => {
      console.log("payment data of Supplier by id", resp);
      this.paymentListDataBySupplierId = resp.data;
      console.log(
        "this is payment list data by Supplier id",
        this.paymentListDataBySupplierId
      );
    });
  }

  getPurchaseReturn(){
    this.purchaseReturnService
      .getPurchaseReturnBySupplierId(this.id)
      .subscribe((resp: any) => {
        console.log("Purchase Retrun Data response by customer id ", resp);

        this.purchaseReturnDataShowById = resp.data;
        console.log(
          "Purchase Return Data by customer id ",
          this.purchaseReturnDataShowById
        );
      });
  }

  getPurchaseReturnPaymentListBySupplierId(){
    this.purchaseReturnService
      .getPurchaseReturnPaymentListBySupplierId(this.id)
      .subscribe((resp: any) => {
        console.log("Purchase payment Return data of customer by id", resp);
        this.paymentReturnDataListById = resp.data;
        console.log(
          "this is Purchase return payment list data by customer id",
          this.paymentReturnDataListById
        );
      });
  }
  deletePurchase(Id: any) {
    this.purchaseId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Purchase Details",
    };
    this.showDialoge = true;
  }

  callBackModal() {
    this.purchaseService.DeletePurchaseData(this.purchaseId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.getPurchase();
      this.showDialoge = false;
    });
  }

  close() {
    console.log("close dialog triggered");
    this.showDialoge = false;
    this.showInvoiceDialog = false;
    this.showPaymentDialog = false;

    this.getPurchase();
    this.getPaymentListBySupplierId();
    this.getPurchaseReturn();
    this.getPurchaseReturnPaymentListBySupplierId();
    // this.salesService.getAllSalesByCustomerId(this.id).subscribe((resp: any) => {
    //   console.log("payments of customer", resp);
    //   this.salesDataShowById = resp.data;
    //   console.log("this is sale of customer by id ", this.salesDataShowById)
    // });
  }

  showInvoiceDialoge(Id: any) {
    // to open the sales invoice popup
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ");
    this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.purchaseDataShowById = [resp.data];
      this.header = "Purchase Invoice ";
      console.log("Purchase data by id On dialog", this.purchaseDataShowById);
    });

    this.PaymentOutService.getPurchasePaymentListByPurchaseId(Id).subscribe((resp: any) => {
      this.paymentDataListById = resp.data;
      console.log("this is payment by Purchase id", this.paymentDataListById);
    });
  }
  showReturnInvoiceDialoge(Id: any) {
    // to open the sales invoice popup
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ");
    this.purchaseReturnService.getPurchaseReturnById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.purchaseDataShowById = [resp.data];
      this.header = "Purchase Return Invoice ";
      console.log("Purchase data by id On dialog", this.purchaseDataShowById);
    });

    this.purchaseReturnService
      .getPurchaseReturnPaymentListbyPurchaseReturnId(Id)
      .subscribe((resp: any) => {
        this.paymentDataListById = resp.data;
      });
  }

  openPaymentDialog(Id: any) {
    this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
      this.showPaymentDialog = true;
      this.paymentObject = {
        supplier: resp.data.supplier,
        purchaseId: Id,
        isPurchase: true,
        purchaseInvoiceNumber: resp.data.purchaseInvoiceNumber,
        purchaseTotalAmount: resp.data.purchaseTotalAmount,
        purchaseDueAmount: resp.data.dueAmount,
      };
      // console.log("this is user data on popup dialog of payment invoice",this.salesDataShowById);
    });
  }
  openPaymentReturnDialog(Id: any) {
    this.purchaseReturnService.getPurchaseReturnById(Id).subscribe((resp: any) => {
      this.showPaymentDialog = true;
      this.paymentObject = {
        supplier: resp.data.supplier,
        purchaseReturnId: Id,
        isPurchaseReturn: true,
        // purchaseReturnDataShowById: resp.data
        purchaseInvoiceNumber: resp.data.purchaseInvoiceNumber,
        purchaseTotalAmount: resp.data.purchaseTotalAmount,
        purchaseDueAmount: resp.data.dueAmount,
      };
      console.log(
        "this is open Payment Return Dialog",
        this.paymentObject.purchaseReturnId
      );
    });
  }

}
