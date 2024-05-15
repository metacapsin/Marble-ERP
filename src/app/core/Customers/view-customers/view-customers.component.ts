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
    PaymentsInvoiceDialogComponent
  ],
  providers: [MessageService],

  templateUrl: "./view-customers.component.html",
  styleUrl: "./view-customers.component.scss",
})
export class ViewCustomersComponent {
  routes = routes;
  customerData: any[] = [];
  paymentListData: any[] = [];
  salesDataById: any[] = [];
  id: any;
  salesId: any;
  
  // dataById:any[]=[];
  
  paymentData: any[] = [];
  saleId: any[]=[];
  showDialoge = false;
  modalData: any = {};

  showInvoiceDialog: boolean = false;
  saleData = [];
  header:string="Payment Details";
  paymentVisible: boolean = false;

  selectedSalesData: any;

  visible: boolean = false;

  showPaymentDialog: boolean = false;

  // showPaymentDialog: boolean = false

  showDialog() {
    this.visible = true;
  }

  // this.socialLinks = this._data.socialLinks;

  constructor(
    private Service: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentInService: PaymentInService,
    private salesService: SalesService,
    private router: Router,
    private messageService: MessageService // public dialog: MatDialog,
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();

    this.PaymentInService.getPaymentList().subscribe((resp: any) => {
      console.log("payments of customer", resp);
      this.paymentListData = resp.data;
    });

    this.getsales();
  }

  getsales() {
    this.salesService.GetSalesData().subscribe((resp: any) => {
      console.log("sales of custonmer ", resp);

      this.salesDataById = resp.data;
      // console.log("sales Data by id ",this.salesDataById);
    });
  }

  getCoustomers() {
    this.Service.GetCustomerDataById(this.id).subscribe((data: any) => {
      console.log(data);
      this.customerData = [data];
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

  showNewDialog() {
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
    this.showDialoge = false;
  }

  showInvoiceDialoge(Id: any) {
    console.log("id pass to dialoge", Id);
    debugger;
    this.showInvoiceDialog = true;
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.saleData = [resp.data];
      console.log("sales data by id On dialog", this.salesDataById);
    });
    // this.showInvoiceDialog=false
  }
  hideDialog() {
    this.showInvoiceDialog = false;
    this.saleData = [];
    console.log(this.saleData);
  }
  editSalesRout(id) {
    this.router.navigate(["/sales/edit-sales/" + id]);
  }
  openPaymentDialog(Id: any) {
    console.log("pass id in payment", Id);

    // this.modalData = Id
    this.showPaymentDialog = true;
    this.paymentVisible = true;
    this.salesService.GetSalesDataById(Id).subscribe((resp: any) => {
      this.salesDataById = [resp.data];
      console.log("this is user data on popup dialog of payment invoice")
    });

  }
  // callbackModalForPayment(Id){
  //   this.PaymentInService.getPaymentById(Id).subscribe((resp: any) => {
  //     this.paymentData = [resp.data];
  //     console.log("Payment Data dialog",this.paymentData );
  //   });
  // }
  
}
