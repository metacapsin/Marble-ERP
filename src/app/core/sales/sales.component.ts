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
import { LocalStorageService } from 'src/app/shared/data/local-storage.service';

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

  totalPaidAmount: any;
  totalDueAmount: any;
  totalAmount: any;

  visibleTotalPaidAmount: number = 0;
  visibleTotalDueAmount: number = 0;
  visibleTotalAmount: number = 0;
  currentUrl: string;
  header: any;


  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private Service: SalesService,
  private localStorageService:LocalStorageService) { }

  ngOnInit() {
    this.GetSalesData();
    this.currentUrl = this.router.url;
    console.log("this is current url on sales page",this.currentUrl)
    this.localStorageService.removeItem('customer');
    this.localStorageService.removeItem('returnUrl');


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

  navigateToCreateSale(){
    const returnUrl = this.router.url;
    this.localStorageService.setItem('returnUrl',returnUrl);
    console.log("this is return url on sales  page for sales create",returnUrl)
    this.router.navigate(['/sales/add-sales']);
    


  }

  GetSalesData() {
    this.Service.GetSalesData().subscribe((resp: any) => {
      this.totalPaidAmount = resp.totalPaidAmount;
      this.totalDueAmount = resp.totalDueAmount;
      this.totalAmount = resp.totalAmount;
      this.salesListData = resp.data;
      this.originalData = resp.data;
    });
  }
  
  editSalesRout(id) {
    this.router.navigate(["/sales/edit-sales/" + id]);
  }


  showInvoiceDialoge(Id: any) { 
    this.Service.GetSalesDataById(Id).subscribe((resp: any) => {
      this.header="Sales Invoice"
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


  // public searchData(value: any): void {
  //   this.salesListData = this.originalData.map(i => {
  //     if (i.salesInvoiceNumber.toLowerCase().includes(value.trim().toLowerCase())) {
  //       return i;
  //     }
  //   });
  // }


}
