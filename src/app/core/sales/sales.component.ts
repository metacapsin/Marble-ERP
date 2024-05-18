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

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, DialogModule, ToastModule, TabViewModule],
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
  visible: boolean = false;
  paymentVisible: boolean = false;
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

  showDialog(_id: any) {
    // let totalTax = 0;
    // // this.visible = true;
    // this.Service.GetSalesDataById(_id).subscribe((resp: any) => {
    //   this.salesDataById = [resp.data];
      
    // this.visible = true;

    //   resp.data.appliedTax.forEach(element => {
    //     totalTax += Number(element.taxRate);
    //   });
    //   this.addTaxTotal = resp.data.salesGrossTotal * totalTax / 100;
    //   // console.log("applied tax", resp.data.appliedTax);
    // });

    // this.Service.getSalesPaymentList(_id).subscribe((resp: any) => {
    //   this.paymentListData = resp.data;
    //   // console.log("payment id ser ", this.paymentListData);
    // })
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
  close() {
    this.showDialoge = false;
  }



  GetSalesData() {
    this.Service.GetSalesData().subscribe((resp: any) => {
      this.salesListData = resp.data;
      this.originalData = resp.data;
    });
  }
  editSalesRout(id) {
    this.router.navigate(["/sales/edit-sales/" + id]);
  }

  public searchData(value: any): void {
    this.salesListData = this.originalData.map(i => {
      if (i.salesInvoiceNumber.toLowerCase().includes(value.trim().toLowerCase())) {
        return i;
      }
    });
  }

}
