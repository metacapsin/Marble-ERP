import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../customers.service";
import { PaymentInService } from "../../payment-in/payment-in.service";
import { SalesService } from "../../sales/sales.service";
import { MessageService } from "primeng/api";
import { SharedModule } from "src/app/shared/shared.module";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { PaymentsInvoiceDialogComponent } from "src/app/common-component/modals/payments-invoice-dialog/payments-invoice-dialog.component";
import { SalesReturnService } from "../../sales-return/sales-return.service";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

interface Product {
  _id: string;
  salesId: string;
  salesInvoice: string | null;
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
    salesInvoiceNumber: string;
  paymentDetails: Array<{
    amountType: string;
    amount: number;
    paymentMode: string;
  }>;
  expanded?: boolean;

}

@Component({
  selector: "app-view-customers",
  standalone: true,
  imports: [SharedModule, InvoiceDialogComponent, PaymentsInvoiceDialogComponent,],
  templateUrl: "./view-customers.component.html",
  styleUrl: "./view-customers.component.scss",
})
export class ViewCustomersComponent implements OnInit {
  routes = routes;
  id: any; // to hold customer id
  customerDataById: any[] = [];
  products: Product[] = [];
  expanded?: boolean;

  salesDataShowById: any; // to hold sales data by customer id
  salesReturnDataShowById: any[] = []; // to hold sales Return data by customer id
  paymentListDataByCustomerId: any[] = []; // to hold payment data by customer id
  showInvoiceDialog: boolean = false; // to enable sales invoice popup
  showPaymentDialog: boolean = false; //to payment in inovice popup
  showDialoge: boolean = false; // to enable delete popup
  modalData: any = {}; // to print delete message on delete api
  customerID: any;
  salesId: any;
  salesReturnID: any;
  salesPaymentId: any;
  salesReturnPaymentId: any;
  paymentDataListById: any[] = [];
  paymentReturnDataListById: any[] = [];
  paymentObject: any = {};
  salesTotalDueAmount: number = 0;
  header = "";
  currentUrl: string;
  customer: any;
  dueBalance:any;
  openingBlncId:any;
  paymentInvoicesalesDataShowById: any; // to hold sales data by customer id
  OpeningBalance:any;
  openingBalPayList:any;
  salesTotalValues: any = {};
  paymentInTotalValues: any = {};
  salesReturnTotalValues: any = {};
  paymentOutTotalValues: any = {};
  balanceId:any;
  constructor(
    private customerService: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private salesPayment: PaymentInService,
    private salesService: SalesService,
    private salesReturnService: SalesReturnService,
    private router: Router,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();
    // this.getOpeningBalance();
    this.getOpeningBalancePayList()
    this.getsales();
    this.getPaymentListByCustomerId();
    this.getsalesReturn();
    this.getSalesReturnPaymentListByCustomerId();
  }
  getCoustomers() {
    this.customerService.GetCustomerDataById(this.id).subscribe((data: any) => {
      // console.log("Customer data by id", data);
      this.customerID = data._id;
      // console.log("customer id", this.customerID);
      this.customerDataById = [data];
      this.customer = {
        name: this.customerDataById[0].name,
        billingAddress: this.customerDataById[0].billingAddress,
        _id: this.customerDataById[0]._id,
      };
      console.log("this is customer object", this.customer);
    });
  }

  getOpeningBalance(){
    this.customerService.GetOpeningBalanceById(this.id).subscribe((data:any)=>{
      this.dueBalance = data.data
      if(this.salesTotalValues && this.dueBalance){
        this.salesTotalValues.totalPaidAmount += this.dueBalance?.paidAmount; 
        this.salesTotalValues.totalDueAmount += this.dueBalance?.dueAmount;
        this.salesTotalValues.totalAmount += this.dueBalance?.totalAmount;
      }
      this.salesDataShowById?.unshift({
        type: 'openBalance'
      });
    })
  }

  getOpeningBalancePayList(){
    this.customerService.GetOpeningBalancePayListById(this.id).subscribe((data:any)=>{
      this.openingBalPayList = data.data;
    })
  }

  getsales() {
    this.salesTotalDueAmount = 0;
    this.salesService
      .getAllSalesByCustomerId(this.id)
      .subscribe((resp: any) => {
        this.salesTotalValues = resp;
        this.salesDataShowById = resp.data;
        this.getOpeningBalance()
      });
  }

  getPaymentListByCustomerId() {
    this.salesPayment
      .getPaymentListByCustomerId(this.id)
      .subscribe((resp: any) => {
        this.paymentInTotalValues = resp;
        this.paymentListDataByCustomerId = resp.data;
      });
  }
  getsalesReturn() {
    this.salesReturnService
      .getSalesReturnByCustomerId(this.id)
      .subscribe((resp: any) => {
        this.salesReturnTotalValues = resp;
        this.salesReturnDataShowById = resp.data;
      });
  }
  getSalesReturnPaymentListByCustomerId() {
    this.salesReturnService
      .getSalesReturnPaymentListByCustomerId(this.id)
      .subscribe((resp: any) => {
        console.log("sales payment Return data of customer by id", resp);
        this.paymentOutTotalValues = resp;
        this.paymentReturnDataListById = resp.data;
      });
  }

  deleteSales(Id: any) {
    this.salesId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Details",
    };
    this.showDialoge = true;
  }

  deleteOpeningBlnc(Id: any) {
    this.openingBlncId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Opening Balance Details",
    };
    this.showDialoge = true;
  }

  deleteSalesReturn(Id: any) {
    this.salesReturnID = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Return Details",
    };
    this.showDialoge = true;
  }

  deleteSalesPayment(Id: any) {
    this.salesPaymentId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Details"
    }
    this.showDialoge = true;
  }

  deleteOpeningBalnc(Id: any) {
    this.balanceId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Details"
    }
    this.showDialoge = true;
  }

  deleteSalesReturnPayment(Id: any) {
    this.salesReturnPaymentId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment Details"
    }
    this.showDialoge = true;
  }

  callBackModal() {
    if (this.salesId) {
      this.salesService.DeleteSalesData(this.salesId).subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getsales();
        this.getPaymentListByCustomerId();
        this.getsalesReturn();
        this.getSalesReturnPaymentListByCustomerId();
        this.showDialoge = false;
        this.salesId=null;
      });
    } else if (this.salesReturnID) {
      this.salesReturnService.deleteSalesReturn(this.salesReturnID).subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getsales();
        this.getPaymentListByCustomerId();
        this.getsalesReturn();
        this.getSalesReturnPaymentListByCustomerId();
        this.showDialoge = false;
        this.salesReturnID=null;
      });
    }
    else if (this.salesPaymentId) {
      this.salesPayment.deletePaymentById(this.salesPaymentId).subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getsales();
        this.getPaymentListByCustomerId();
        this.showDialoge = false;
        this.salesPaymentId=null;
      });
    }
    else if (this.salesReturnPaymentId) {
      this.salesReturnService.deleteSalesReturnPayment(this.salesReturnPaymentId).subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getsalesReturn();
        this.getSalesReturnPaymentListByCustomerId();
        this.showDialoge = false;
        this.salesReturnPaymentId=null;
      });
    }else if(this.openingBlncId){
      this.salesReturnService.deleteopeningBalance(this.openingBlncId).subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getOpeningBalance();
        this.getOpeningBalancePayList();
        
        this.showDialoge = false;
        this.openingBlncId=null;
      });
    }else if(this.balanceId){
      this.salesReturnService.deleteBalancePayRec(this.balanceId).subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getOpeningBalancePayList();
        this.getOpeningBalance();

        this.showDialoge = false;
        this.balanceId=null;
      });
    }
  }

  toggleRow(product:Product) {
    product.expanded = !product.expanded;
  }

  close() {
    this.showDialoge = false;
    this.showInvoiceDialog = false;
    this.showPaymentDialog = false;
    this.getOpeningBalancePayList();
    this.getOpeningBalance();
    this.getsales();
    this.getPaymentListByCustomerId();
    this.getsalesReturn();
    this.getSalesReturnPaymentListByCustomerId();
  }

  showInvoiceDialoge(Id: any) {
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.salesDataShowById = [resp?.data];
      console.log("this is sales data by id",this.salesDataShowById)
      this.header = "Sales Invoice";
      console.log("this is sales data by id",this.salesDataShowById[0].creditPeriod)
    });

    this.salesService.getSalesPaymentList(Id).subscribe((resp: any) => {
      this.paymentDataListById = resp?.data;
    });
  }
  showReturnInvoiceDialoge(Id: any) {
    this.salesReturnService.getSalesReturnById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.salesDataShowById = [resp?.data];
      this.header = "Sales Return Invoice";
      console.log("this is sales data by id",this.salesDataShowById)
    });

    this.salesReturnService
      .getSalesReturnPaymentListBySalesReturnId(Id)
      .subscribe((resp: any) => {
        this.paymentDataListById = resp?.data;
      });
  }

  navigateToCreateSales() {
    const customer = {
      name: this.customerDataById[0].name,
      billingAddress: this.customerDataById[0].billingAddress,
      _id: this.customerDataById[0]._id,
    };
    this.localStorageService.setItem("customer", customer);
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl)
    this.router.navigateByUrl("/sales/add-sales");
  }
  navigateToCreateSalesReturn() {
    const customer1 = {
      name: this.customerDataById[0]?.name,
      billingAddress: this.customerDataById[0]?.billingAddress,
      _id: this.customerDataById[0]?._id,
    };

    this.localStorageService.setItem("customer1", customer1);
    const returnUrl = this.router.url;
    this.localStorageService.setItem("returnUrl", returnUrl)
    this.router.navigateByUrl("/sales-return/add-sales-return");
  }
  openPaymentDialog(Id: any) {
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showPaymentDialog = true;
      this.paymentInvoicesalesDataShowById = [resp?.data];
      this.header = "Sales Payment ";
      this.paymentObject = {
        customer: resp?.data?.customer,
        salesId: Id,
        isSales: true,
        salesInvoiceNumber: resp?.data?.salesInvoiceNumber,
        salesTotalAmount: resp?.data?.salesTotalAmount,
        salesDueAmount: resp?.data?.dueAmount,
        salesPaidAmount: resp?.data?.paidAmount,
        taxable: resp?.data?.taxable,
        taxableDue: resp?.data?.taxableDue,
        nonTaxable: resp?.data?.nonTaxable,
        nonTaxableDue: resp?.data?.nonTaxableDue,
      };
      console.log("this is api response on payment dialog open ",resp?.data)
    })
    // this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
    //   this.showPaymentDialog = true;
    //   this.paymentInvoicesalesDataShowById = [resp?.data];
    // });
  }

  openeningBalancepopup(Id: any) {
    this.customerService.GetOpeningBalanceById(this.id).subscribe((resp:any)=>{
      this.showPaymentDialog = true;
      this.paymentInvoicesalesDataShowById = [resp?.data];
      this.header = "Opening Balance";
      this.paymentObject = {
        customer: resp?.data?.customer,
        salesId: Id,
        customerId:this.id,
        isSales: true,
        salesInvoiceNumber:'Opening Balance',
        salesTotalAmount: resp?.data?.totalAmount,
        paidAmount: resp?.data?.paidAmount,
        salesDueAmount: resp?.data?.dueAmount,
        salesPaidAmount: resp?.data?.paidAmount,
        taxable: resp?.data?.taxable,
        taxableDue: resp?.data?.taxableDue,
        nonTaxable: resp?.data?.nonTaxable,
        nonTaxableDue: resp?.data?.nonTaxableDue,
      };
      console.log("this is api response on payment dialog open ",resp?.data)
    })
    // this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
    //   this.showPaymentDialog = true;
    //   this.paymentInvoicesalesDataShowById = [resp?.data];
    // });
  }

  openPaymentReturnDialog(Id: any) {
    this.salesReturnService.getSalesReturnById(Id).subscribe((resp: any) => {
      this.showPaymentDialog = true;
      this.paymentInvoicesalesDataShowById = [resp?.data];

      this.header = "Sales Return Payment ";
      this.paymentObject = {
        customer: resp?.data?.customer,
        salesReturnId: Id,
        isSalesReturn: true,
        // salesReturnDataShowById: resp?.data
        salesInvoiceNumber: resp?.data?.salesInvoiceNumber,
        salesTotalAmount: resp?.data?.salesTotalAmount,
        salesDueAmount: resp?.data?.dueAmount,
      };
      console.log(
        "this is open Payment Return Dialog",
        this.paymentObject.salesReturnId
      );
    });
    // this.salesReturnService.getSalesReturnById(Id).subscribe((resp: any) => {
    //   this.showPaymentDialog = true;
    //   this.paymentInvoicesalesDataShowById = [resp.data];
    //   this.header = "Sales Return Invoice ";
    //   console.log("sales data by id On Payment Return dialog", this.paymentInvoicesalesDataShowById);
    // });
  }
}
