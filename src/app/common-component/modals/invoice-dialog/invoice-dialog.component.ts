import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";

import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { SharedModule } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { CustomersdataService } from 'src/app/core/Customers/customers.service';
import { SalesService } from 'src/app/core/sales/sales.service';
import { PaymentInService } from 'src/app/core/payment-in/payment-in.service';

@Component({
  selector: 'app-invoice-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, RouterModule, TableModule, CalendarModule, DialogModule, ToastModule, TabViewModule],
  templateUrl: './invoice-dialog.component.html',
  styleUrl: './invoice-dialog.component.scss'
})
export class InvoiceDialogComponent {
  @Input() showDialog: boolean = false;
  @Input() data: any;
  @Output() callbackModal = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  routes = routes;
  customerData: any[] = [];
  paymentListData: any[] = [];
  salesDataById: any[] = [];
  id: any;
  visible: any;
  paymentVisible: any;

  saleId: any;
  showDialoge = false;
  modalData: any = {};
  

  constructor(
    // private Service: CustomersdataService,
    // private activeRoute: ActivatedRoute,
    private PaymentInService: PaymentInService,
    private salesService: SalesService,
    private router: Router,
  ) {
    // routes.ac
   }
 
  ngOnInit() {

    this.salesService.GetSalesDataById(this.id).subscribe(
      (resp: any) => {
        console.log("sales of custonmer ", resp);

        this.salesDataById = resp.data;
        // console.log("sales Data by id ",this.salesDataById);
      }
    );
  }

  // openDialog(salesDataById: any) {
  //   this.visible = true;
  //   this.salesDataById = salesDataById;
  // }

  // openPaymentDialog(salesDataById: any) {
  //   this.paymentVisible = true;
  //   this.salesDataById = salesDataById;
  // }

  // closeDialog() {
  //   this.visible = false;
  // }

  // closePaymentDialog() {
  //   this.paymentVisible = false;
  // }
  
  closeTheWindow(){
     this.close.emit();
  }

  okay(){
    this.callbackModal.emit();


  }


  // deleteSales(Id: any) {
  //   this.saleId = Id;

  //   this.modalData = {
  //     title: "Delete",
  //     messege: "Are you sure you want to delete this Sales Details"
  //   }
  //   this.showDialoge = true;
  // }

  // showNewDialog() {
  //   this.showDialoge = true;
  // }

  // callBackModal() {
  //   this.Service.DeleteSalesData(this.saleId).subscribe((resp: any) => {
  //     this.messageService.add({ severity: 'success', detail: resp.message });
  //     this.GetSalesData();
  //     this.showDialoge = false;
  //   })
  // }

  // close() {
  //   this.showDialoge = false;
  // }
}

