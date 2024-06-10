import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../customers.service";
import { PaymentInService } from "../../payment-in/payment-in.service";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { SalesService } from "../../sales/sales.service";
import { MessageService } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";

// import { MatDialog } from "@angular/material/dialog";
import { SharedModule } from "src/app/shared/shared.module";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";
import { PaymentsInvoiceDialogComponent } from "src/app/common-component/modals/payments-invoice-dialog/payments-invoice-dialog.component";
import { SalesReturnService } from "../../sales-return/sales-return.service";
import { PaymentOutService } from "../../payment-out/payment-out.service";

@Component({
  selector: "app-view-customers",
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

  templateUrl: "./view-customers.component.html",
  styleUrl: "./view-customers.component.scss",
})
export class ViewCustomersComponent implements OnInit {
  routes = routes;
  id: any; // to hold customer id
  customerDataById: any[] = [];
  salesDataShowById: any; // to hold sales data by customer id
  salesReturnDataShowById: any[] = []; // to hold sales Return data by customer id
  paymentListDataByCustomerId: any[] = []; // to hold payment data by customer id
  showInvoiceDialog: boolean = false; // to enable sales invoice popup
  showPaymentDialog: boolean = false; //to payment in inovice popup
  showDialoge: boolean = false; // to enable delete popup
  modalData: any = {}; // to print delete message on delete api
  customerID: any;
  salesId: any;
  salesReturnID:any;
  paymentDataListById: any[] = [];
  paymentReturnDataListById: any[] = [];
  paymentObject: any = {};
  salesTotalDueAmount: number = 0;
  header = "";

  salesTotalValues: any = {};
  paymentInTotalValues: any = {};
  salesReturnTotalValues: any = {};
  paymentOutTotalValues: any = {};

  constructor(
    private customerService: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private salesPayment: PaymentInService,
    private salesReturnPayment: PaymentOutService,
    private salesService: SalesService,
    private salesReturnService: SalesReturnService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();
    this.getsales();
    this.getPaymentListByCustomerId();
    this.getsalesReturn();
    this.getSalesReturnPaymentListByCustomerId();
  }
  getCoustomers() {
    this.customerService.GetCustomerDataById(this.id).subscribe((data: any) => {
      console.log("Customer data by id", data);
      this.customerID = data._id;
      console.log("customer id", this.customerID);
      this.customerDataById = [data];
    });
  }

  // getTotalPaidAmount(arrayProperty: 'salesDataShowById' | 'salesReturnDataShowById'): number {
  //   const arrayToUse = this[arrayProperty];
  //   if (!arrayToUse || !Array.isArray(arrayToUse) || arrayToUse.length === 0) {
  //     return 0;
  //   }
  //   return arrayToUse?.reduce((total, payment) => total + Number(payment.paidAmount), 0);
  // }
  
  // getTotalDuoAmount(arrayProperty: 'salesDataShowById' | 'salesReturnDataShowById'): number {
  //   const arrayToUse = this[arrayProperty];

  //   return arrayToUse?.reduce((total, payment) => total + Number(payment.dueAmount), 0);
  // }
  // getTotalAmount(arrayProperty: 'salesDataShowById' | 'salesReturnDataShowById'): number {
  //   const arrayToUse = this[arrayProperty];

  //   return arrayToUse?.reduce((total, payment) => total + payment.salesTotalAmount, 0);
  // }
  // getTotalPaymentAmount(arrayProperty: 'paymentListDataByCustomerId' | 'paymentReturnDataListById'): number {
  //   const arrayToUse = this[arrayProperty];

  //   return arrayToUse?.reduce((total, payment) => total + payment.amount, 0);
  // }

  getsales() {
    this.salesTotalDueAmount = 0;
    this.salesService
      .getAllSalesByCustomerId(this.id)
      .subscribe((resp: any) => {
        this.salesTotalValues = resp;
        this.salesDataShowById = resp.data;
      });
  }

  getPaymentListByCustomerId() {
    this.salesPayment
      .getPaymentListByCustomerId(this.id)
      .subscribe((resp: any) => {
        console.log("payment data of customer by id", resp);
        this.paymentInTotalValues = resp;
        this.paymentListDataByCustomerId = resp.data;
        console.log(
          "this is payment list data by customer id",
          this.paymentListDataByCustomerId
        );
      });
  }
  getsalesReturn() {
    this.salesReturnService
      .getSalesReturnByCustomerId(this.id)
      .subscribe((resp: any) => {
        console.log("Sales Retrun Data response by customer id ", resp);

        this.salesReturnTotalValues = resp;
        this.salesReturnDataShowById = resp.data;
        console.log(
          "Sales Return Data by customer id ",
          this.salesReturnDataShowById
        );
      });
  }
  getSalesReturnPaymentListByCustomerId() {
    this.salesReturnService
      .getSalesReturnPaymentListByCustomerId(this.id)
      .subscribe((resp: any) => {
        console.log("sales payment Return data of customer by id", resp);
        this.paymentOutTotalValues = resp;
        this.paymentReturnDataListById = resp.data;
        console.log(
          "this is sales return payment list data by customer id",
          this.paymentReturnDataListById
        );
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
  deleteSalesReturn(Id: any) {
    this.salesReturnID = Id;
    
    console.log("sales Return Delete Dialog triggred and this is its id", Id)

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Return Details",
    };
    this.showDialoge = true;
  }

  callBackModal() {
    if(this.deleteSales)
    this.salesService.DeleteSalesData(this.salesId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.getsales();
      this.showDialoge = false;
      
    });
    if(this.deleteSalesReturn)
    this.salesReturnService.deleteSalesReturn(this.salesReturnID).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.getsalesReturn();
      this.showDialoge = false;

    });
  }

  close() {
    console.log("close dialog triggered");
    this.showDialoge = false;
    this.showInvoiceDialog = false;
    this.showPaymentDialog = false;

    this.getsales();
    this.getPaymentListByCustomerId();
    this.getsalesReturn();
    this.getSalesReturnPaymentListByCustomerId();
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
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.salesDataShowById = [resp.data];
      this.header = "Sales Invoice ";
      console.log("sales data by id On dialog", this.salesDataShowById);
    });

    this.salesService.getSalesPaymentList(Id).subscribe((resp: any) => {
      this.paymentDataListById = resp.data;
      console.log("this is payment by sales id", this.paymentDataListById);
    });
  }
  showReturnInvoiceDialoge(Id: any) {
    // to open the sales invoice popup
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ");
    this.salesReturnService.getSalesReturnById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.salesDataShowById = [resp.data];
      this.header = "Sales Return Invoice ";
      console.log("sales data by id On dialog", this.salesDataShowById);
    });

    this.salesReturnService
      .getSalesReturnPaymentListBySalesReturnId(Id)
      .subscribe((resp: any) => {
        this.paymentDataListById = resp.data;
        console.log("this is sales return payment list by sales return id",this.paymentDataListById)
      });
  }

  openPaymentDialog(Id: any) {
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showPaymentDialog = true;
      this.header = "Sales Payment ";
      this.paymentObject = {
        customer: resp.data.customer,
        salesId: Id,
        isSales: true,
        salesInvoiceNumber: resp.data.salesInvoiceNumber,
        salesTotalAmount: resp.data.salesTotalAmount,
        salesDueAmount: resp.data.dueAmount,
      };
      // console.log("this is user data on popup dialog of payment invoice",this.salesDataShowById);
    });
  }
  openPaymentReturnDialog(Id: any) {
    this.salesReturnService.getSalesReturnById(Id).subscribe((resp: any) => {
      this.showPaymentDialog = true;
      this.header = "Sales Return Payment ";
      this.paymentObject = {
        customer: resp.data.customer,
        salesReturnId: Id,
        isSalesReturn: true,
        // salesReturnDataShowById: resp.data
        salesInvoiceNumber: resp.data.salesInvoiceNumber,
        salesTotalAmount: resp.data.salesTotalAmount,
        salesDueAmount: resp.data.dueAmount,
      };
      console.log(
        "this is open Payment Return Dialog",
        this.paymentObject.salesReturnId
      );
    });
  }
}
