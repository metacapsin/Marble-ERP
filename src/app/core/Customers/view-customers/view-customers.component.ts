import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
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
export class ViewCustomersComponent {
  routes = routes;
  id: any; // to hold customer id
  customerDataById: any[] = []; 
  salesDataShowById: any[] = []; // to hold sales data by customer id
  paymentListDataById: any[] = []; // to hold payment data by customer id
  showInvoiceDialog: boolean = false; // to enable sales invoice popup
  showPaymentDialog: boolean = false; //to payment in inovice popup
  showDialoge:boolean = false; // to enable delete popup
  modalData: any = {}; // to print delete message on delete api
  customerID: any;
 

  // paymentDataById: any[] = [];
  // saleId: any[] = [];

  // paymentVisible: boolean = false;

  // selectedSalesData: any;

  // visible: boolean = false;

  // // Sale Invoice Dialog Variables

  // saleData = [];

  // // Payment Invoice Dialog Variables


  // //  Delete Confirm Dialog variables

  // showDialog() {
  //   this.visible = true;
  // }

  constructor(
    private customerService: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private salesPayment: PaymentInService,
    private salesService: SalesService,
    private router: Router,
  //   private messageService: MessageService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
  //   this.getCoustomers();

    this.salesPayment.getSalesByCustomerId(this.id).subscribe((resp: any) => {
      console.log("payments of customer", resp);
      this.salesDataShowById = resp.data;
      console.log("this is sale of customer by id ", this.salesDataShowById)
    });

  //   this.getsales();
  // }

  // getsales() {
    // this.salesService.get(this.id).subscribe((resp: any) => {
    //   console.log("Sales Data response by customer id ", resp);

    //   this.salesDataById = resp.data;
    //   console.log("sales Data by customer id ",this.salesDataById);
    // });
  // }

  // getpayment(){
  //   this.PaymentInService.getPaymentDetailById(this.id).subscribe((resp:any)=>{
  //     console.log("payment of customer",resp)
  //     this.paymentDataById=resp.data;
  //   })
  // }

  // getCoustomers() {
    this.customerService.GetCustomerDataById(this.id).subscribe((data: any) => {
      console.log("Customer data by id",data);
      this.customerID=data._id;
      console.log("customer id",this.customerID)
      this.customerDataById = [data];
  //   });
  })}

  deleteSales(Id: any) {
    // this.salesId = Id;

    // this.modalData = {
    //   title: "Delete",
    //   messege: "Are you sure you want to delete this Sales Details",
    // };
    // this.showDialoge = true;
  }

  // showNewDialog() {
  //   this.showDialoge = true;
  // }

  callBackModal() {

    // console.log("now delete and callback modal ")
    // this.salesService.DeleteSalesData(this.salesId).subscribe((resp: any) => {
    //   this.messageService.add({ severity: "success", detail: resp.message });
    //   this.getsales();
    //   this.showDialoge = false;
    // });
    // this.PaymentInService.deletePaymentById(this.salesId).subscribe((resp:any)=>{
    //   this.messageService.add({ severity:"success",detail:resp.message});
    //   this.getpayment();
    //   this.showDialoge=false;
    // })
  }

  close() {
    console.log("close dialog triggered")
  //   this.showDialoge = false;
    this.showInvoiceDialog = false;
  //   this.showPaymentDialog = false;
  //   this.saleData = [];
  //   this.paymentListData=[]
  //   console.log(this.saleData);
  //   console.log(this.paymentListData);
  }

  showInvoiceDialoge(Id: any) {   // to open the sales invoice popup
    console.log("id pass to invoice dialoge", Id);
    this.showInvoiceDialog = true;
    console.log("showInvoiceDialoge is triggered ")
    // this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
    //   this.saleData = [resp.data];
    //   console.log("sales data by id On dialog", this.saleData);
    // });
    // this.showInvoiceDialog=false
  }

  editSalesRout(id) { // to edit the sales in view 
    // this.router.navigate(["/sales/edit-sales/" + id]);
    this.router.navigate([`/sales/edit-sales/${id}`]);
    

  }
  openPaymentDialog(Id: any) {
    console.log("pass id in payment invoice ", Id);

    // this.modalData = Id
    // this.showPaymentDialog = true;
    // this.paymentVisible = true;
    // this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
    //   this.salesDataById = [resp.data];
    //   console.log("this is user data on popup dialog of payment invoice");
    // });
  }
}
