import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SuppliersdataService } from "../suppliers.service";
import { PurchaseService } from "../../purchase/purchase.service";
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { MessageService } from "primeng/api";
import { PaymentInService } from "../../payment-in/payment-in.service";
import { PurchaseReturnService } from "../../purchase-return/purchase-return.service";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { PaymentsInvoiceDialogComponent } from "src/app/common-component/modals/payments-invoice-dialog/payments-invoice-dialog.component";
import { SharedModule } from "src/app/shared/shared.module";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { CustomersdataService } from "../../Customers/customers.service";
import { SalesReturnService } from "../../sales-return/sales-return.service";

interface Product {
  _id: string;
  purchaseId: string;
  purchaseInvoice: string | null;
  paymentDate: string;
  paymentMode: string;
  amount: number;
  transactionNo: string;
  note: string;
  customer: {
    _id: string;
    name: string;
    billingAddress: string;
  };
  purchaseInvoiceNumber: string;
  paymentDetails: Array<{
    amountType: string;
    amount: number;
    paymentMode: string;
  }>;
  expanded?: boolean;
}

@Component({
  selector: "app-view-suppliers",
  standalone: true,
  imports: [
    SharedModule,
    InvoiceDialogComponent,
    PaymentsInvoiceDialogComponent,
  ],
  templateUrl: "./view-suppliers.component.html",
  styleUrl: "./view-suppliers.component.scss",
})
export class ViewSuppliersComponent {
  routes = routes;
  id: any; // to hold supplier id
  supplierDataById: any[] = [];
  products: Product[] = [];
  expanded?: boolean;
  purchaseDataShowById: any; // to hold purchase data by supplier id
  purchaseReturnDataShowById: any[] = []; // to hold purchase Return data by supplier id
  paymentListDataBySupplierId: any[] = []; // to hold payment data by Supplier id
  showInvoiceDialog: boolean = false; // to enable purchase invoice popup
  showPaymentDialog: boolean = false; //to payment in inovice popup
  showDialoge: boolean = false; // to enable delete popup
  modalData: any = {}; // to print delete message on delete api
  supplierID: any;
  purchaseReturnId: any;
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
  paymentInvoicePurchaseDataShowById: any; // to hold purchase data by supplier id for payment invoice
  PurchaseReturnPaymentId: any;
  PurchasePaymentId: any;
  dueBalance: any;
  openingBalPayList: any;
  balanceId: any;
  constructor(
    private SupplierService: SuppliersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentOutService: PaymentOutService,
    private PaymentInService: PaymentInService,
    private purchaseService: PurchaseService,
    private purchaseReturnService: PurchaseReturnService,
    private router: Router,
    private salesReturnService: SalesReturnService,
    private customerService: CustomersdataService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getSuppliers();
    // this.getOpeningBalance();
    // this.getOpeningBalancePayList();
    this.getPurchase();
    this.getPaymentListBySupplierId();
    this.getPurchaseReturn();
    this.getPurchaseReturnPaymentListBySupplierId();
    this.currentUrl = this.router.url;
  }

  getOpeningBalance() {
    this.customerService
      .GetOpeningBalanceById(this.id)
      .subscribe((data: any) => {
        this.dueBalance = data.data;
        if(this.purchaseTotalValues && this.dueBalance){
          this.purchaseTotalValues.totalPaidAmount += this.dueBalance?.paidAmount; 
          this.purchaseTotalValues.totalDueAmount += this.dueBalance?.dueAmount;
          this.purchaseTotalValues.totalPurchaseCost += this.dueBalance?.totalAmount;
        }
        this.purchaseDataShowById?.unshift({
          type: 'openBalance'
        });
      });
  }

  getOpeningBalancePayList() {
    this.customerService
      .GetOpeningBalancePayListById(this.id)
      .subscribe((data: any) => {
        this.openingBalPayList = data.data;
        this.paymentListDataBySupplierId = [...this.openingBalPayList, ...this.paymentListDataBySupplierId];
        // this.purchaseDataShowById?.unshift({
        //   type: 'openBalance'
        // });
      });
  }

  getSuppliers() {
    this.SupplierService.GetSupplierDataById(this.id).subscribe((data: any) => {
      this.supplierID = data._id;
      this.supplierDataById = [data];
      this.supplier = {
        name: this.supplierDataById[0].name,
        billingAddress: this.supplierDataById[0].billingAddress,
        _id: this.supplierDataById[0]._id,
      };
    });
  }

  deleteOpeningBalnc(Id: any) {
    this.balanceId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Details",
    };
    this.showDialoge = true;
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
        this.getOpeningBalance();
      });
  }

  getPaymentListBySupplierId() {
    this.PaymentOutService.getPurchasePaymentListBySupplierId(
      this.id
    ).subscribe((resp: any) => {
      this.paymentOutTotalValues = resp;
      // console.log("payment data of Supplier by id", resp);
      this.paymentListDataBySupplierId = resp.data;
      this.getOpeningBalancePayList()
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

  allApiCall() {
    console.log("All api called");
    this.getPurchase();
    this.getPaymentListBySupplierId();
    this.getPurchaseReturn();
    this.getPurchaseReturnPaymentListBySupplierId();
  }

  toggleRow(product: Product) {
    product.expanded = !product.expanded;
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
    console.log(this.purchaseId);
    this.showDialoge = true;
    console.log("first");
    this.modalData = {
      title: "Delete",
      messege: " Are you sure you want to delete this Purchase",
    };
  }
  deletePurchaseReturn(Id: any) {
    this.purchaseReturnId = Id;
    console.log(this.purchaseReturnId);

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Purchase Return",
    };
    this.showDialoge = true;
  }

  deletePurchasePayment(Id: any) {
    this.PurchasePaymentId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment",
    };
    this.showDialoge = true;
  }
  deletePurchaseReturnPayment(Id: any) {
    this.PurchaseReturnPaymentId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Details",
    };
    this.showDialoge = true;
  }

  callBackModal() {
    if (this.purchaseId) {
      this.purchaseService
        .DeletePurchaseData(this.purchaseId)
        .subscribe((resp: any) => {
          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
          this.allApiCall();
          this.showDialoge = false;
        });
    } else if (this.purchaseReturnId) {
      this.purchaseReturnService
        .deletePurchaseReturn(this.purchaseReturnId)
        .subscribe((resp: any) => {
          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
          this.allApiCall();
          this.showDialoge = false;
        });
    } else if (this.PurchasePaymentId) {
      this.PaymentOutService.deletePurchasePayment(
        this.PurchasePaymentId
      ).subscribe((resp: any) => {
        console.log(this.PurchasePaymentId);
        this.messageService.add({ severity: "success", detail: resp.message });
        this.allApiCall();
        this.showDialoge = false;
      });
    } else if (this.PurchaseReturnPaymentId) {
      this.purchaseReturnService
        .deletePurchaseReturnPaymentById(this.PurchaseReturnPaymentId)
        .subscribe((resp: any) => {
          console.log(this.PurchaseReturnPaymentId);

          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
          this.allApiCall();
          this.showDialoge = false;
        });
    } else if (this.balanceId) {
      this.salesReturnService
        .deleteBalancePayRec(this.balanceId)
        .subscribe((resp: any) => {
          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
          this.getOpeningBalancePayList();
          this.getOpeningBalance();
          this.showDialoge = false;
          this.balanceId = null;
        });
    }
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

    this.router.navigateByUrl("/new-purchase/add-new-purchase");
  }

  navigateToCreatePurchaseReturn() {
    const supplier1 = {
      name: this.supplierDataById[0].name,
      _id: this.supplierDataById[0]._id,
      billingAddress: this.supplierDataById[0].billingAddress,
    };
    this.localStorageService.setItem("supplier1", supplier1);
    console.log("this is supplier 1 object for purchase return", supplier1);

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
    // this.getOpeningBalancePayList();
    // this.getOpeningBalance();
    // this.allApiCall();

    if(this.header === 'Purchase Payment'){
      this.getPurchase();
    this.getPaymentListBySupplierId();
    } else if (this.header === 'Purchase Payment Return Payment') {
      this.getPurchaseReturn();
      this.getPurchaseReturnPaymentListBySupplierId();
    } else {
      this.getPurchase();
      this.getPaymentListBySupplierId();
    }
  }

  showInvoiceDialoge(Id: any) {
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ");
    this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.purchaseDataShowById = [resp.data];
      this.header = "Purchase Invoice";
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
        this.header = "Purchase Return Invoice";
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

  openPaymentDialog(Id: any, key: any) {
    console.log("click", Id);
    if (key === "duebalance") {
      if (Id) {
        console.log("click1");
        this.customerService
          .GetOpeningBalanceById(Id)
          .subscribe((resp: any) => {
            this.header = "Opening Balance";
            this.showPaymentDialog = true;

            this.paymentInvoicePurchaseDataShowById = [resp.data];
            console.log(
              "purchase data show success message",
              this.paymentInvoicePurchaseDataShowById
            );
            this.paymentObject = {
              supplier: resp.data.supplier,
              purchaseId: Id,
              isPurchase: true,
              customerId: this.id,
              purchaseInvoiceNumber: "Opening Balance",
              salesInvoiceNumber: "Opening Balance",
              supplierTotalAmount: resp?.data?.totalAmount,
              paidAmount: resp?.data?.paidAmount,
              purchaseCost: resp.data.purchaseCost,
              purchaseDueAmount: resp.data.dueAmount,
              taxableDue: resp.data.taxableDue,
              nonTaxableDue: resp.data.nonTaxableDue,
              taxable: resp.data.taxable,
              nonTaxable: resp.data.nonTaxable,
            };
          });
      }
    } else {
      if (Id) {
        console.log("click2");
        this.purchaseService.GetPurchaseDataById(Id).subscribe((resp: any) => {
          this.header = "Purchase Payment";
          this.showPaymentDialog = true;

          this.paymentInvoicePurchaseDataShowById = [resp.data];
          console.log(
            "purchase data show success message",
            this.paymentInvoicePurchaseDataShowById
          );
          this.paymentObject = {
            supplier: resp.data.supplier,
            purchaseId: Id,
            isPurchase: true,
            purchaseInvoiceNumber: resp.data.purchaseInvoiceNumber,
            purchaseCost: resp.data.purchaseCost,
            purchaseDueAmount: resp.data.dueAmount,
            taxableDue: resp.data.taxableDue,
            nonTaxableDue: resp.data.nonTaxableDue,
            taxable: resp.data.taxable,
            nonTaxable: resp.data.nonTaxable,
          };
        });
      }
    }
  }
  openPaymentReturnDialog(Id: any) {
    if (Id) {
      this.purchaseReturnService
        .getPurchaseReturnById(Id)
        .subscribe((resp: any) => {
          this.showPaymentDialog = true;
          this.paymentInvoicePurchaseDataShowById = [resp.data];
          this.header = "Purchase Return Payment";
          this.paymentObject = {
            supplier: resp.data.supplier,
            purchaseReturnId: Id,
            isPurchaseReturn: true,
            purchaseInvoiceNumber: resp.data.purchaseInvoiceNumber,
            purchaseReturnTotalAmount: resp.data.purchaseReturnTotalAmount,
            purchaseDueAmount: resp.data.dueAmount,
            purchasePaidAmount: resp.data.paidAmount,
          };
          console.log(
            "this is open Payment Return Dialog",
            this.paymentObject.purchaseReturnId
          );
        });
    }
  }
}
