import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../customers.service";
import { PaymentInService } from "../../payment-in/payment-in.service";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { SalesService } from "../../sales/sales.service";
import { MessageService, SharedModule } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { InvoiceDialogComponent } from "src/app/common-component/modals/invoice-dialog/invoice-dialog.component";

@Component({
  selector: "app-view-customers",
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, RouterModule, TableModule, CalendarModule, DialogModule, ToastModule, TabViewModule, InvoiceDialogComponent],
  providers:[MessageService],

  templateUrl: "./view-customers.component.html",
  styleUrl: "./view-customers.component.scss",
})
export class ViewCustomersComponent {
  routes = routes;
  customerData: any[] = [];
  paymentListData: any[] = [];
  salesDataById: any[] = [];
  id: any;

  saleId: any;
  showDialoge = false;
  modalData: any = {};

  // this.socialLinks = this._data.socialLinks;

  constructor(
    private Service: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentInService: PaymentInService,
    private salesService: SalesService,
    private router: Router,
    private messageService:MessageService,

  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();

    this.PaymentInService.getPaymentList().subscribe(
      (resp: any) => {
        console.log("payments of customer",resp)
        
        this.paymentListData = resp.data;


      }
    );
    this.salesService.GetSalesData().subscribe(
      (resp: any) => {
        console.log("sales of custonmer ", resp);

        this.salesDataById = resp.data;
        // console.log("sales Data by id ",this.salesDataById);
      }
    );
  }
  getCoustomers() {
    this.Service.GetCustomerDataById(this.id).subscribe((data: any) => {
      console.log(data);
      this.customerData = [data];
    });
  }

  // showInvoiceDialog(id: any) {
  //   this.router.navigate(["/customers/invoice-customers/" + id]);
  // }

  // editSalesRout(id) {
  //   this.router.navigate(["/sales/edit-sales/" + id]);
  // }
  // deleteSales(Id: any) {
  //   this.saleId = Id;

  //   this.modalData = {
  //     title: "Delete",
  //     messege: "Are you sure you want to delete this Sales Details"
  //   }
  //   this.showDialoge = true;
  // }

  // showInvoiceDialog(Id: any) {
  //   this.saleId = Id;

  //   this.modalData = {
  //     title: "Delete",
  //     messege: "Are you sure you want to delete this Sales Details"
  //   }
  //   this.showDialoge = true;
  // }
  // showInvoiceDialog(Id) {
  //   this.showDialoge = true;
  // }

  // callBackModal() {
  //   // this.salesService.DeleteSalesData(this.saleId).subscribe((resp: any) => {
  //   //   this.messageService.add({ severity: 'success', detail: resp.message });
  //   //   this.GetSalesData();
  //   //   this.showDialoge = false;
  //   // })
  // }

  // close() {
  //   this.showDialoge = false;
  // }

  // GetSalesData() {
  //   this.salesService.GetSalesDataById(this.id).subscribe((resp: any) => {
  //     this.sal = resp.data;
  //     this.originalData = resp.data;

  //   })
  






  showInvoiceDialog(Id: any) {
    this.saleId = Id;

    // this.modalData = {
    //   title: "Delete",
    //   messege: "Are you sure you want to delete this Sales Details"
    // }
    // this.showDialoge = true;
  }

  showNewDialoge() {
    this.showDialoge = true;
  }

  callBackModal() {
    // this.salesService.DeleteSalesData(this.saleId).subscribe((resp: any) => {
    //   this.messageService.add({ severity: 'success', detail: resp.message });
    //   // this.GetSalesData();
    //   this.showDialoge = false;
    // })
  }

  close() {
    this.showDialoge = false;
  }



}
