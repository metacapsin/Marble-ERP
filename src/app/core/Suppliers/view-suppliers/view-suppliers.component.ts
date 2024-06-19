import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SuppliersdataService } from "../suppliers.service";
import { PurchaseService } from "../../purchase/purchase.service";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { MessageService } from "primeng/api";
import { PurchaseInvoiceDialogComponent } from "src/app/common-component/modals/purchase-invoice-dialog/purchase-invoice-dialog.component";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { PaymentInService } from "../../payment-in/payment-in.service";
import { PurchaseReturnService } from "../../purchase-return/purchase-return.service";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { PaymentsInvoiceDialogComponent } from "src/app/common-component/modals/payments-invoice-dialog/payments-invoice-dialog.component";
import { SharedModule } from "src/app/shared/shared.module";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

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
  purchaseTotalValues: any = {};
  paymentInTotalValues: any = {};
  purchaseReturnTotalValues: any = {};
  paymentOutTotalValues: any = {};
  purchaseTotalDueAmount: number = 0;
  header = "";
  currentUrl: string;
  supplier: any;

  constructor(
    private SupplierService: SuppliersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentOutService: PaymentOutService,
    private PaymentInService: PaymentInService,
    private purchaseService: PurchaseService,
    private purchaseReturnService: PurchaseReturnService,
    private router: Router,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getSuppliers();
    this.getPurchase();
    this.getPaymentListBySupplierId();
    this.getPurchaseReturn();
    this.getPurchaseReturnPaymentListBySupplierId();
    this.currentUrl = this.router.url;
  }
  getSuppliers() {
    this.SupplierService.GetSupplierDataById(this.id).subscribe((data: any) => {
      console.log("supplier data by id", data);
      this.supplierID = data._id;
      console.log("supplier id", this.supplierID);
      this.supplierDataById = [data];
      console.log("this is supplier data by id", this.supplierDataById);
      this.supplier = {
        name: this.supplierDataById[0].name,
        billingAddress: this.supplierDataById[0].billingAddress,
        _id: this.supplierDataById[0]._id,
      };
      console.log("this is supplier object", this.supplier);
    });
  }

  // getTotalPaidAmount(arrayProperty: 'purchaseDataShowById' | 'purchaseReturnDataShowById'): number {
  //   const arrayToUse = this[arrayProperty];
  //   return arrayToUse?.reduce((total, payment) => total + Number(payment.paidAmount), 0);
  // }
  // getTotalDuoAmount(arrayProperty: 'purchaseDataShowById' | 'purchaseReturnDataShowById'): number {
  //   const arrayToUse = this[arrayProperty];

  //   return arrayToUse?.reduce((total, payment) => total + Number(payment.dueAmount), 0);
  // }
  // getTotalAmount(arrayProperty: 'purchaseDataShowById' | 'purchaseReturnDataShowById'): number {
  //   const arrayToUse = this[arrayProperty];

  //   return arrayToUse?.reduce((total, payment) => total + payment.purchaseReturnTotalAmount, 0);
  // }
  getTotalPaymentAmount(
    arrayProperty: "paymentListDataBySupplierId" | "paymentReturnDataListById"
  ): number {
    const arrayToUse = this[arrayProperty];

    return arrayToUse?.reduce((total, payment) => total + payment.amount, 0);
  }

  getPurchase() {
    this.purchaseTotalDueAmount = 0;
    this.purchaseService
      .getAllPurchaseBySupplierId(this.id)
      .subscribe((resp: any) => {
        this.purchaseTotalValues = resp;
        this.purchaseDataShowById = resp.data;
      });
  }

  getPaymentListBySupplierId() {
    this.PaymentOutService.getPurchasePaymentListBySupplierId(
      this.id
    ).subscribe((resp: any) => {
      this.paymentOutTotalValues = resp;
      // console.log("payment data of Supplier by id", resp);
      this.paymentListDataBySupplierId = resp.data;
      console.log(
        "this is payment list data by Supplier id",
        this.paymentListDataBySupplierId
      );
    });
  }

  getPurchaseReturn() {
    this.purchaseReturnService
      .getPurchaseReturnBySupplierId(this.id)
      .subscribe((resp: any) => {
        this.purchaseReturnTotalValues = resp;
        console.log("Purchase Retrun Data response by customer id ", resp);

        this.purchaseReturnDataShowById = resp.data;
        console.log(
          "Purchase Return Data by customer id ",
          this.purchaseReturnDataShowById
        );
      });
  }

  getPurchaseReturnPaymentListBySupplierId() {
    this.purchaseReturnService
      .getPurchaseReturnPaymentListBySupplierId(this.id)
      .subscribe((resp: any) => {
        console.log("Purchase payment Return data of customer by id", resp);
        this.paymentInTotalValues = resp;
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
    this.purchaseService
      .DeletePurchaseData(this.purchaseId)
      .subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getPurchase();
        this.showDialoge = false;
      });
  }

  navigateToCreatePurchase() {
    const supplier = {
      name: this.supplierDataById[0].name,
      billingAddress: this.supplierDataById[0].billingAddress,
      _id: this.supplierDataById[0]._id,
    };

    this.localStorageService.setItem("supplier", supplier);

    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);

    this.router.navigateByUrl("/purchase/add-purchase");
  }

  navigateToCreatePurchaseReturn() {
    const supplier1 = {
      name: this.supplierDataById[0].name,
      _id: this.supplierDataById[0]._id,
    };
    this.localStorageService.setItem("supplier1", supplier1);
    console.log("this is supplier 1 object for purchase return", supplier1)

    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl);

    console.log(returnUrl);
    this.router.navigateByUrl("/purchase-return/add-purchase-return");
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
  }

  showInvoiceDialoge(Id: any) {
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ");
    this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.purchaseDataShowById = [resp.data];
      this.header = "Purchase Invoice ";
      console.log("Purchase data by id On dialog", this.purchaseDataShowById);
    });

    this.PaymentOutService.getPurchasePaymentListByPurchaseId(Id).subscribe(
      (resp: any) => {
        this.paymentDataListById = resp.data;
        console.log("this is payment by Purchase id", this.paymentDataListById);
        console.log(resp.data);
      }
    );
  }
  showReturnInvoiceDialoge(Id: any) {
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ");
    this.purchaseReturnService
      .getPurchaseReturnById(Id)
      .subscribe((resp: any) => {
        this.showInvoiceDialog = true;
        this.purchaseDataShowById = [resp.data];
        this.header = "Purchase Return Invoice ";
        console.log(resp.data);
        console.log(
          "Purchase Return data by id On dialog",
          this.purchaseDataShowById
        );
      });

    this.purchaseReturnService
      .getPurchaseReturnPaymentListByPurchaseReturnId(Id)
      .subscribe((resp: any) => {
        this.paymentDataListById = resp.data;
        console.log(resp.data);
      });
  }

  openPaymentDialog(Id: any) {
    this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
      this.showPaymentDialog = true;
      this.header = "Purchase Payment ";
      this.paymentObject = {
        supplier: resp.data.supplier,
        purchaseId: Id,
        isPurchase: true,
        purchaseInvoiceNumber: resp.data.purchaseInvoiceNumber,
        purchaseTotalAmount: resp.data.purchaseTotalAmount,
        purchaseDueAmount: resp.data.dueAmount,
      };
    });
  }
  openPaymentReturnDialog(Id: any) {
    this.purchaseReturnService
      .getPurchaseReturnById(Id)
      .subscribe((resp: any) => {
        this.showPaymentDialog = true;
        this.header = "Purchase Return Payment ";
        this.paymentObject = {
          supplier: resp.data.supplier,
          purchaseReturnId: Id,
          isPurchaseReturn: true,
          // purchaseReturnDataShowById: resp.data
          purchaseInvoiceNumber: resp.data.purchaseInvoiceNumber,
          purchaseReturnTotalAmount: resp.data.purchaseReturnTotalAmount,
          purchaseDueAmount: resp.data.dueAmount,
        };
        console.log(
          "this is open Payment Return Dialog",
          this.paymentObject.purchaseReturnId
        );
      });
  }
}
