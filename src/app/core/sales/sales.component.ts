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

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, DialogModule, ToastModule],
  providers: [MessageService]
})
export class SalesComponent implements OnInit {
  public routes = routes;

  public searchDataValue = '';
  selectedSales = '';
  customerList = [];
  saleId: any;
  showDialoge = false;
  modalData: any = {};
originalData = [];
  visible: boolean = false;

   


  salesPopupData = [
    {
      salesInvoiceNumber: "abc@11234",
      salesCustomerName: "Adnan Hussain",
      salesDate: "25 April 2024",
      salesOrderTakenBy: "Adnan Hussain",
      salesOrderStatus: "Ordered",
      salesCategory: "Electronics",
      salesName: "Mobile",
      salesQuantity: "3",
      salesUnitPrice: "120",
      salesSubTotal: "350",
      salesOrderTax: "20",
      salesShipping: "200",
      salesDiscount: "50",
      salesTotalAmount: "1250",

    }
  ];
  salesDataById= []
  salesListData = []

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private customerService: CustomersdataService,
    private Service: SalesService) { }

  ngOnInit() {

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.customerList = resp;
    });

    this.GetSalesData();
  }

  showDialog(_id: any) {
    this.visible = true;
    this.Service.GetSalesDataById(_id).subscribe((resp: any) => {
      this.salesDataById = [resp.data];
    })
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
      
    })
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
