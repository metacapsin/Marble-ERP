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
  
  @Input() showInvoiceDialog: boolean = false;
  @Input() data: any;
  // @Output() callbackModal = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  salesDataById = [];

  constructor(private salesService: SalesService) { }
 
  ngOnInit() {
    if(this.showInvoiceDialog){
      console.log("id i invoice", this.data.id);

    }
    
    // this.salesService.GetSalesDataById(this.data).subscribe((resp:any) => {
    //   this.salesDataById = [resp.data];
    //   console.log("On dialog", this.salesDataById);
      
    // })
    
  }
  
  closeTheWindow(){
     this.close.emit();
  }

  // okay(){
  //   this.callbackModal.emit();
  // }
}

