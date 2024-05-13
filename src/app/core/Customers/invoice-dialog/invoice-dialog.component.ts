import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService, SharedModule } from 'primeng/api';
import { SalesService } from '../../sales/sales.service';
import { CustomersdataService } from '../customers.service';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-invoice-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, RouterModule, TableModule, CalendarModule, DialogModule, ToastModule, TabViewModule],
  providers: [MessageService],
  templateUrl: './invoice-dialog.component.html',
  styleUrl: './invoice-dialog.component.scss'
})
export class InvoiceDialogComponent {
  paymentListData = [];
  salesDataById = [];
  originalData = [];
  salesId:any;

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private customerService: CustomersdataService,
    private Service: SalesService
  ) {
    this.salesId = this.activeRoute.snapshot.params["id"];

   }


    ngOnInit() {
      this.GetSalesDataById();

      this.Service.getSalesPaymentList(this.salesId).subscribe((resp: any) => {
      this.paymentListData = resp.data;
      // console.log("payment id ser ", this.paymentListData);
    })


   
  }
    
  GetSalesDataById() {
      this.Service.GetSalesDataById(this.salesId).subscribe((resp: any) => {
        this.salesDataById = [resp.data];
  
      })
    }
}
