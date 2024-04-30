import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from '../../Customers/customers.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SalesReturnService } from '../sales-return.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-all-sales-return',
  templateUrl: './all-sales-return.component.html',
  styleUrl: './all-sales-return.component.scss',
  providers: [MessageService],
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, ToastModule]
})
export class AllSalesReturnComponent implements OnInit {
  public routes = routes;

  public searchDataValue = '';
  selectedSales = '';
  customerList = [];
  saleId: any;
  showDialoge = false;
  modalData: any = {};
originalData = [];
  visible: boolean = false;
  salesReturnDataById= []
  salesReturnListData = []
  salesData = [
    {
      salesInvoiceNumber: 1112,
      salesDate: "16 April 2024",
      salesCustomer: "Adnan",
      salesStatus: "Delivered",
      salesPaidAmount: "$2250",
      salesTotalAmount: "$3000",
      salesPaymentStatus: "Paid",
    }
  ];

  


  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private customerService: CustomersdataService,
    private Service: SalesReturnService) { }

  ngOnInit() {

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.customerList = resp;
      console.log("customer", this.customerList);
    });
    this.GetSalesReturnData();

  }

  deleteSalesReturn(Id: any) {
    this.saleId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Return Details"
    }
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.deleteSalesReturn(this.saleId).subscribe((resp: any) => {
      this.messageService.add({ severity: 'success', detail: resp.message });
      this.GetSalesReturnData();
      this.showDialoge = false;
    })
  }

  close() {
    this.showDialoge = false;
  }

  GetSalesReturnData() {
    this.Service.getSalesReturnList().subscribe((resp: any) => {
      this.salesReturnListData = resp.data;
      this.originalData = resp.data;
      
    })
  }

  editSalesRout(id) {
    this.router.navigate(["/sales-return/edit-sales-return/" + id]);
  }


}
