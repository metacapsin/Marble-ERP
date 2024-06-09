import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from '../Customers/customers.service';
import { SalesService } from './sales.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { PaymentInService } from '../payment-in/payment-in.service';
import { InvoiceDialogComponent } from 'src/app/common-component/modals/invoice-dialog/invoice-dialog.component';

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, DialogModule, ToastModule, TabViewModule, InvoiceDialogComponent],
  providers: [MessageService]
})
export class SalesComponent implements OnInit {
  public routes = routes;
  addTaxTotal: any;
  public searchDataValue = '';
  selectedSales = '';
  customerList = [];
  paymentListData = [];
  saleId: any;
  showDialoge = false;
  modalData: any = {};
  originalData = [];
  showInvoiceDialog: boolean = false;
  salesDataById = []
  salesListData = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private Service: SalesService) { }

  ngOnInit() {
    this.GetSalesData();
  }

  deleteSales(Id: any) {
    this.saleId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Details"
    }
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.DeleteSalesData(this.saleId).subscribe((resp: any) => {
      this.messageService.add({ severity: 'success', detail: resp.message });
      this.GetSalesData();
      this.showDialoge = false;
    })
  }


  GetSalesData() {
    this.Service.GetSalesData().subscribe((resp: any) => {
      this.salesListData = resp.data;
      this.originalData = resp.data;
    });
  }
  getTotalPaidAmount(): number {
    return this.salesListData.reduce((total, payment) => total + Number(payment.paidAmount), 0);
  }
  getTotalDuoAmount(): number {

    return this.salesListData.reduce((total, payment) => total + Number(payment.dueAmount), 0);
  }
  getTotalAmount(): number {

    return this.salesListData.reduce((total, payment) => total + payment.salesTotalAmount, 0);
  }
  
  editSalesRout(id) {
    this.router.navigate(["/sales/edit-sales/" + id]);
  }


  showInvoiceDialoge(Id: any) { 
    this.Service.GetSalesDataById(Id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.salesDataById = [resp.data];
      console.log("sales data by id On dialog", this.salesDataById);
    });

    this.Service.getSalesPaymentList(Id).subscribe((resp:any) => {
      this.paymentListData = resp.data;
    });
  }
  
  close() {
    this.showDialoge = false;
    this.showInvoiceDialog = false;
  }


  public searchData(value: any): void {
    this.salesListData = this.originalData.map(i => {
      if (i.salesInvoiceNumber.toLowerCase().includes(value.trim().toLowerCase())) {
        return i;
      }
    });
  }

}
