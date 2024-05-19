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
import { checkMargins } from "ngx-bootstrap/positioning";

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
export class ViewCustomersComponent implements OnInit{
  routes = routes;
  id: any; // to hold customer id
  customerDataById: any[] = []; 
  salesDataShowById: any; // to hold sales data by customer id
  paymentListDataByCustomerId: any[] = []; // to hold payment data by customer id
  showInvoiceDialog: boolean = false; // to enable sales invoice popup
  showPaymentDialog: boolean = false; //to payment in inovice popup
  showDialoge:boolean = false; // to enable delete popup
  modalData: any = {}; // to print delete message on delete api
  customerID: any;
  salesId: any;
  paymentDataListById: any[] = [];
  paymenyObject:any={}

  constructor(
    private customerService: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private salesPayment: PaymentInService,
    private salesService: SalesService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();

    this.salesService.getAllSalesByCustomerId(this.id).subscribe((resp: any) => {
      console.log("payments of customer", resp);
      this.salesDataShowById = resp.data;
      console.log("this is sale of customer by id ", this.salesDataShowById)
    });

    this.getsales();
    this.getpaymentListByCustomerId();
  }

  getsales() {
    this.salesService.getAllSalesByCustomerId(this.id).subscribe((resp: any) => {
      console.log("Sales Data response by customer id ", resp);

      this.salesDataShowById = resp.data;
      console.log("sales Data by customer id ",this.salesDataShowById);
    });
  }

  getpaymentListByCustomerId(){
    this.salesPayment.getPaymentListByCustomerId(this.id).subscribe((resp:any)=>{
      console.log("payment data of customer by id",resp)
      this.paymentListDataByCustomerId=resp.data;
      console.log("this is payment list data by customer id",this.paymentListDataByCustomerId)
    })
  }

  getCoustomers() {
    this.customerService.GetCustomerDataById(this.id).subscribe((data: any) => {
      console.log("Customer data by id",data);
      this.customerID=data._id;
      console.log("customer id",this.customerID)
      this.customerDataById = [data];
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

  callBackModal() {

    this.salesService.DeleteSalesData(this.salesId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.getsales();
      this.showDialoge = false;
    });
   
  }

  close() {
    console.log("close dialog triggered")
    this.showDialoge = false;
    this.showInvoiceDialog = false;
    this.showPaymentDialog = false;

    this.salesService.getAllSalesByCustomerId(this.id).subscribe((resp: any) => {
      console.log("payments of customer", resp);
      this.salesDataShowById = resp.data;
      console.log("this is sale of customer by id ", this.salesDataShowById)
    });
  }

  showInvoiceDialoge(Id: any) {   // to open the sales invoice popup
    console.log("id pass to invoice dialoge", Id);
    console.log("showInvoiceDialoge is triggered ")
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.salesDataShowById = [resp.data];
      console.log("sales data by id On dialog", this.salesDataShowById);
    });

    this.salesService.getSalesPaymentList(Id).subscribe((resp:any) => {
      this.paymentDataListById = resp.data
      console.log("this is payment by sales id", this.paymentDataListById)
    })

  }

  openPaymentDialog(Id: any) {
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showPaymentDialog = true;
      this.paymenyObject = {
        customer: resp.data.customer,
        salesId: resp.data._id,
        salesInvoiceNumber: resp.data.salesInvoiceNumber,
        salesTotalAmount: resp.data.salesTotalAmount,
        salesDueAmount:resp.data.dueAmount,
      };
      console.log("this is user data on popup dialog of payment invoice",this.salesDataShowById);
    });
  }
}
